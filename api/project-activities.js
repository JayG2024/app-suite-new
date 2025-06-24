import { db } from '@/lib/db';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const { projectId } = req.query;
        
        if (projectId) {
          // Get activities for specific project
          const activities = await db.query(
            `SELECT pa.*, u.name as user_name, u.email as user_email
             FROM project_activities pa
             LEFT JOIN users u ON pa.user_id = u.id
             WHERE pa.project_id = $1
             ORDER BY pa.created_at DESC
             LIMIT 50`,
            [projectId]
          );
          
          return res.status(200).json({ activities: activities.rows });
        } else {
          // Get all recent activities
          const activities = await db.query(
            `SELECT pa.*, p.name as project_name, u.name as user_name
             FROM project_activities pa
             LEFT JOIN projects p ON pa.project_id = p.id
             LEFT JOIN users u ON pa.user_id = u.id
             ORDER BY pa.created_at DESC
             LIMIT 100`
          );
          
          return res.status(200).json({ activities: activities.rows });
        }

      case 'POST':
        const { 
          project_id, 
          activity_type, 
          activity_description, 
          metadata,
          user_id 
        } = req.body;

        // Log the activity
        const activity = await db.query(
          `INSERT INTO project_activities 
           (project_id, activity_type, activity_description, metadata, user_id, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           RETURNING *`,
          [project_id, activity_type, activity_description, metadata || {}, user_id]
        );

        // Handle special activity types with automated actions
        if (activity_type === 'email_sent') {
          await handleEmailSentActivity(project_id, metadata);
        } else if (activity_type === 'status_changed') {
          await handleStatusChangeActivity(project_id, metadata);
        } else if (activity_type === 'task_completed') {
          await handleTaskCompletedActivity(project_id, metadata);
        }

        return res.status(201).json({ activity: activity.rows[0] });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Project activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Handle automated actions when kickoff email is sent
async function handleEmailSentActivity(projectId, metadata) {
  if (metadata?.email_type === 'project-kickoff') {
    // Update project status to "in_progress"
    await db.query(
      `UPDATE projects 
       SET status = 'in_progress', 
           started_at = NOW(),
           updated_at = NOW()
       WHERE id = $1`,
      [projectId]
    );

    // Create initial tasks based on project type
    const project = await db.query(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );

    if (project.rows[0]) {
      const projectType = project.rows[0].project_type;
      const tasks = getInitialTasksForProject(projectType);
      
      for (const task of tasks) {
        await db.query(
          `INSERT INTO tasks 
           (project_id, title, description, status, priority, estimated_hours, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [projectId, task.title, task.description, 'todo', task.priority, task.estimated_hours]
        );
      }
    }

    // Send notification to team
    await db.query(
      `INSERT INTO notifications 
       (user_id, type, title, message, project_id, created_at)
       SELECT u.id, 'project_started', 'Project Kickoff', 
              'Kickoff email sent for ' || p.name, $1, NOW()
       FROM users u, projects p
       WHERE p.id = $1 AND u.role IN ('admin', 'developer')`,
      [projectId]
    );
  }
}

// Handle project status changes
async function handleStatusChangeActivity(projectId, metadata) {
  const { old_status, new_status } = metadata;

  if (new_status === 'completed') {
    // Update project completion date
    await db.query(
      `UPDATE projects 
       SET completed_at = NOW(), 
           progress = 100,
           updated_at = NOW()
       WHERE id = $1`,
      [projectId]
    );

    // Mark all tasks as completed
    await db.query(
      `UPDATE tasks 
       SET status = 'completed',
           completed_at = NOW()
       WHERE project_id = $1 AND status != 'completed'`,
      [projectId]
    );
  }
}

// Handle task completion and update project progress
async function handleTaskCompletedActivity(projectId, metadata) {
  // Calculate project progress based on completed tasks
  const result = await db.query(
    `SELECT 
       COUNT(*) as total_tasks,
       COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks
     FROM tasks
     WHERE project_id = $1`,
    [projectId]
  );

  if (result.rows[0].total_tasks > 0) {
    const progress = Math.round(
      (result.rows[0].completed_tasks / result.rows[0].total_tasks) * 100
    );

    await db.query(
      `UPDATE projects 
       SET progress = $2,
           updated_at = NOW()
       WHERE id = $1`,
      [projectId, progress]
    );
  }
}

// Get initial tasks based on project type
function getInitialTasksForProject(projectType) {
  const standardTasks = [
    { title: 'Discovery & Requirements', description: 'Gather and document all project requirements', priority: 'high', estimated_hours: 8 },
    { title: 'Database Design', description: 'Design and implement database schema', priority: 'high', estimated_hours: 12 },
    { title: 'Core Backend Development', description: 'Implement business logic and API endpoints', priority: 'high', estimated_hours: 40 },
    { title: 'Frontend Development', description: 'Build user interfaces and interactions', priority: 'medium', estimated_hours: 32 },
    { title: 'Testing & QA', description: 'Test all features and fix bugs', priority: 'medium', estimated_hours: 16 },
    { title: 'Deployment', description: 'Deploy to production environment', priority: 'low', estimated_hours: 4 }
  ];

  const aiTasks = [
    { title: 'AI Integration Setup', description: 'Configure ChatGPT/Claude API connections', priority: 'high', estimated_hours: 8 },
    { title: 'AI Workflow Design', description: 'Design and implement AI-powered features', priority: 'high', estimated_hours: 16 },
    { title: 'NLP Implementation', description: 'Implement natural language processing features', priority: 'medium', estimated_hours: 12 }
  ];

  const enterpriseTasks = [
    { title: 'System Architecture', description: 'Design scalable enterprise architecture', priority: 'high', estimated_hours: 16 },
    { title: 'Security Implementation', description: 'Implement advanced security features', priority: 'high', estimated_hours: 20 },
    { title: 'Integration Development', description: 'Build integrations with existing systems', priority: 'medium', estimated_hours: 24 },
    { title: 'Performance Optimization', description: 'Optimize for enterprise scale', priority: 'medium', estimated_hours: 16 }
  ];

  let tasks = [...standardTasks];

  if (projectType === 'ai_enhanced' || projectType === 'enterprise') {
    tasks = [...tasks, ...aiTasks];
  }

  if (projectType === 'enterprise') {
    tasks = [...tasks, ...enterpriseTasks];
  }

  return tasks;
}