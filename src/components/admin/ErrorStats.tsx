import React, { useState, useEffect } from 'react';
import { useError } from '../../context/error.context';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertTriangle, Bug, Trash2, RefreshCw } from 'lucide-react';

const ErrorStats: React.FC = () => {
  const { getErrorStats, clearErrorQueue } = useError();
  const [stats, setStats] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const errorStats = getErrorStats();
    setStats(errorStats);
  };

  const handleClearQueue = () => {
    clearErrorQueue();
    loadStats();
  };

  if (!stats) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'network': return 'bg-blue-500';
      case 'validation': return 'bg-purple-500';
      case 'server': return 'bg-red-500';
      case 'client': return 'bg-orange-500';
      case 'unknown': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Error Statistics
            <Badge variant="outline">{stats.total} errors</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadStats}
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearQueue}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Errors</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stats.recent.length}</div>
              <div className="text-sm text-gray-600">Recent Errors</div>
            </div>
          </div>

          {/* Severity Breakdown */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              By Severity
            </h4>
            <div className="space-y-2">
              {Object.entries(stats.bySeverity).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`} />
                    <span className="capitalize">{severity}</span>
                  </div>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="font-medium mb-2">By Category</h4>
            <div className="space-y-2">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
                    <span className="capitalize">{category}</span>
                  </div>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Errors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Recent Errors</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Hide' : 'Show'} Details
              </Button>
            </div>
            
            {isExpanded && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {stats.recent.map((error: any) => (
                  <div key={error.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{error.message}</span>
                      <div className="flex gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(error.severity)} text-white`}
                        >
                          {error.severity}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(error.category)} text-white`}
                        >
                          {error.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-gray-600 text-xs">
                      {new Date(error.timestamp).toLocaleString()}
                    </div>
                    {error.user && (
                      <div className="text-gray-500 text-xs mt-1">
                        User: {error.user.username} ({error.user.role})
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorStats;
