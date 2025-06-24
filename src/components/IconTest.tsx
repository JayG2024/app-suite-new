import { 
  FaGoogle, 
  FaMicrosoft, 
  FaReact, 
  FaAws, 
  FaApple,
  FaGithub,
  FaNodeJs
} from 'react-icons/fa';

import { 
  SiOpenai, 
  SiTypescript, 
  SiFirebase, 
  SiVercel, 
  SiTailwindcss,
  SiGooglecloud,
  SiMongodb,
  SiPostgresql,
  SiRedis
} from 'react-icons/si';

const IconTest = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">React Icons Brand Test</h1>
      
      {/* Available AI/Tech Icons */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">✅ Available in React Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <SiOpenai className="text-2xl text-black" />
            <span className="font-medium">OpenAI</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <FaGoogle className="text-2xl text-blue-500" />
            <span className="font-medium">Google</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <FaMicrosoft className="text-2xl text-blue-600" />
            <span className="font-medium">Microsoft</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="font-medium">Anthropic (Not Available)</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <FaReact className="text-2xl text-blue-400" />
            <span className="font-medium">React</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <SiTypescript className="text-2xl text-blue-600" />
            <span className="font-medium">TypeScript</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <SiFirebase className="text-2xl text-orange-500" />
            <span className="font-medium">Firebase</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <SiVercel className="text-2xl text-black" />
            <span className="font-medium">Vercel</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <SiTailwindcss className="text-2xl text-teal-500" />
            <span className="font-medium">Tailwind</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <FaAws className="text-2xl text-orange-500" />
            <span className="font-medium">AWS</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <SiGooglecloud className="text-2xl text-blue-500" />
            <span className="font-medium">Google Cloud</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <FaGithub className="text-2xl text-gray-800" />
            <span className="font-medium">GitHub</span>
          </div>
        </div>
      </div>

      {/* Database & Infrastructure */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">🗄️ Database & Infrastructure</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <SiMongodb className="text-2xl text-green-500" />
            <span className="font-medium">MongoDB</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <SiPostgresql className="text-2xl text-blue-700" />
            <span className="font-medium">PostgreSQL</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <SiRedis className="text-2xl text-red-600" />
            <span className="font-medium">Redis</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
            <FaNodeJs className="text-2xl text-green-600" />
            <span className="font-medium">Node.js</span>
          </div>
        </div>
      </div>

      {/* Missing Icons */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">❌ Missing from React Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg shadow-sm opacity-60">
            <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center text-white text-xs font-bold">C</div>
            <span className="font-medium">Claude (individual)</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg shadow-sm opacity-60">
            <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center text-white text-xs font-bold">G</div>
            <span className="font-medium">Grok/X.AI</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg shadow-sm opacity-60">
            <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center text-white text-xs font-bold">G</div>
            <span className="font-medium">Gemini (separate)</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg shadow-sm opacity-60">
            <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center text-white text-xs font-bold">E</div>
            <span className="font-medium">Eleven Labs</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Verdict: React Icons is Pretty Good!</h3>
        <p className="text-blue-700 mb-4">
          React Icons actually has more AI/tech brands than expected, including OpenAI and Anthropic! 
          The icons look professional and are properly sized.
        </p>
        <p className="text-blue-700">
          <strong>Recommendation:</strong> Use React Icons for most brands, supplement with Simple Icons for missing ones.
        </p>
      </div>
    </div>
  );
};

export default IconTest;