import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';

interface AdminTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
  className?: string;
}

interface AdminTableProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  columns: AdminTableColumn[];
  data: any[];
  loading?: boolean;
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
  headerActions?: React.ReactNode;
}

const AdminTable: React.FC<AdminTableProps> = ({
  title,
  description,
  icon,
  columns,
  data,
  loading = false,
  emptyState,
  onSort,
  sortField,
  sortDirection = 'desc',
  className = '',
  headerActions,
}) => {
  const handleSort = (field: string) => {
    if (onSort) {
      const newDirection =
        sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
      onSort(field, newDirection);
    }
  };

  const renderSortIcon = (field: string) => {
    if (!onSort || sortField !== field) return null;

    return <span className='ml-1'>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (loading) {
    return (
      <Card
        className={`shadow-lg rounded-xl border border-gray-100 ${className}`}
      >
        <CardHeader className='border-b bg-gradient-to-r from-gray-50 to-gray-100/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {icon && <div className='p-2 bg-blue-100 rounded-lg'>{icon}</div>}
              <div>
                <CardTitle className='text-xl font-bold text-gray-900'>
                  {title}
                </CardTitle>
                {description && (
                  <p className='text-sm text-gray-600 mt-1'>{description}</p>
                )}
              </div>
            </div>
            {headerActions && headerActions}
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='p-8 text-center'>
            <div className='animate-pulse space-y-4'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto'></div>
              <div className='h-4 bg-gray-200 rounded w-2/3 mx-auto'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card
        className={`shadow-lg rounded-xl border border-gray-100 ${className}`}
      >
        <CardHeader className='border-b bg-gradient-to-r from-gray-50 to-gray-100/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {icon && <div className='p-2 bg-blue-100 rounded-lg'>{icon}</div>}
              <div>
                <CardTitle className='text-xl font-bold text-gray-900'>
                  {title}
                </CardTitle>
                {description && (
                  <p className='text-sm text-gray-600 mt-1'>{description}</p>
                )}
              </div>
            </div>
            {headerActions && headerActions}
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {emptyState ? (
            <div className='text-center py-20'>
              <div className='flex flex-col items-center space-y-6'>
                <div className='p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full'>
                  {emptyState.icon}
                </div>
                <div className='max-w-md'>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    {emptyState.title}
                  </h3>
                  <p className='text-gray-500 text-sm leading-relaxed'>
                    {emptyState.description}
                  </p>
                  {emptyState.action && (
                    <div className='mt-4'>{emptyState.action}</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center py-20'>
              <p className='text-gray-500'>Tidak ada data</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`shadow-lg rounded-xl border border-gray-100 ${className}`}
    >
      <CardHeader className='border-b bg-gradient-to-r from-gray-50 to-gray-100/50'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {icon && <div className='p-2 bg-blue-100 rounded-lg'>{icon}</div>}
            <div>
              <CardTitle className='text-xl font-bold text-gray-900'>
                {title}
              </CardTitle>
              {description && (
                <p className='text-sm text-gray-600 mt-1'>{description}</p>
              )}
            </div>
          </div>
          {headerActions && headerActions}
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gradient-to-r from-gray-50 to-gray-100'>
                {columns.map(column => (
                  <TableHead
                    key={column.key}
                    className={`uppercase text-xs text-gray-600 font-bold tracking-wider py-4 px-6 ${
                      column.className || ''
                    } ${
                      column.sortable
                        ? 'cursor-pointer hover:text-green-600'
                        : ''
                    }`}
                    onClick={
                      column.sortable ? () => handleSort(column.key) : undefined
                    }
                  >
                    <div className='flex items-center space-x-1'>
                      <span>{column.label}</span>
                      {column.sortable && renderSortIcon(column.key)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item.id || index}
                  className={`hover:bg-green-50 transition-colors border-b border-gray-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  {columns.map(column => (
                    <TableCell
                      key={column.key}
                      className={`py-4 px-6 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTable;
