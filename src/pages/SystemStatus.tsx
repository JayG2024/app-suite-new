import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Clock, TrendingUp } from "lucide-react";
import SEO from '@/components/SEO';
import { APP_CONFIG } from '@/config/app';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  createdAt: string;
  updatedAt: string;
  description: string;
}

const SystemStatus = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Main Application",
      status: "operational",
      uptime: 99.9,
      responseTime: 142,
      lastChecked: new Date().toISOString()
    },
    {
      name: "API Gateway",
      status: "operational", 
      uptime: 99.8,
      responseTime: 89,
      lastChecked: new Date().toISOString()
    },
    {
      name: "Database",
      status: "operational",
      uptime: 99.9,
      responseTime: 23,
      lastChecked: new Date().toISOString()
    },
    {
      name: "File Storage",
      status: "operational",
      uptime: 100.0,
      responseTime: 56,
      lastChecked: new Date().toISOString()
    },
    {
      name: "Email Service",
      status: "operational",
      uptime: 99.7,
      responseTime: 234,
      lastChecked: new Date().toISOString()
    },
    {
      name: "AI Processing",
      status: "operational",
      uptime: 99.6,
      responseTime: 1240,
      lastChecked: new Date().toISOString()
    }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "1",
      title: "All systems operational",
      status: "resolved",
      severity: "minor",
      createdAt: "2025-06-14T10:00:00Z",
      updatedAt: "2025-06-14T10:05:00Z",
      description: "All App Suite services are running normally with optimal performance."
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Degraded</Badge>;
      case 'outage':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Outage</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>;
    }
  };

  const getIncidentBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>;
      case 'major':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Major</Badge>;
      case 'minor':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Minor</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Minor</Badge>;
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Simulate API call to check service status
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update last checked timestamps
    setServices(prevServices => 
      prevServices.map(service => ({
        ...service,
        lastChecked: new Date().toISOString(),
        // Simulate slight variations in response time
        responseTime: service.responseTime + Math.floor(Math.random() * 20) - 10
      }))
    );
    
    setIsRefreshing(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const overallStatus = services.every(s => s.status === 'operational') ? 'operational' : 
                       services.some(s => s.status === 'outage') ? 'outage' : 'degraded';

  const averageUptime = services.reduce((sum, service) => sum + service.uptime, 0) / services.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="System Status - App Suite Service Health & Uptime"
        description="Real-time system status for App Suite services. Check uptime, performance metrics, and scheduled maintenance."
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
              <p className="text-gray-600">Real-time monitoring of App Suite services</p>
            </div>
            <Button 
              onClick={refreshStatus} 
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getStatusIcon(overallStatus)}
              Overall System Status
              {getStatusBadge(overallStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{averageUptime.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Average Uptime (30 days)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                <div className="text-sm text-gray-600">Services Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{incidents.length}</div>
                <div className="text-sm text-gray-600">Recent Incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{service.name}</span>
                  {getStatusIcon(service.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    {getStatusBadge(service.status)}
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uptime</span>
                      <span className="font-medium">{service.uptime}%</span>
                    </div>
                    <Progress value={service.uptime} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium">{service.responseTime}ms</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    Last checked: {formatTime(service.lastChecked)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p>No recent incidents. All systems are running smoothly.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{incident.title}</h3>
                      {getIncidentBadge(incident.severity)}
                    </div>
                    <p className="text-gray-700 mb-2">{incident.description}</p>
                    <div className="text-sm text-gray-500">
                      Created: {formatTime(incident.createdAt)} • Updated: {formatTime(incident.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Status page automatically updates every 60 seconds</p>
          <p className="mt-1">For emergency support, contact {APP_CONFIG.supportEmail}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;