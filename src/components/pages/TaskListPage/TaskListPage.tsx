import { TaTypography, TaLoader, TaSearchBar, TaStack, TaButton } from '@/components/atoms';
import { TaTable, type Column } from '@/components/molecules';
import { TaManageTaskForm } from '@/components/organisms';
import { PAGE_SIZES } from '@/constants';
import { useGetAllTasksQuery, type ITask } from '@/store';
import { useState } from 'react';

export const TaskListPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [search, setSearch] = useState('');
  const [showManageTaskForm, setShowManageTaskForm] = useState(false);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);

  const { data, isLoading } = useGetAllTasksQuery({
    page,
    limit: pageSize,
    search,
  });

  const columns: Column[] = [
    {
      id: 'title',
      label: 'Title',
    },
    {
      id: 'description',
      label: 'Description',
    },
    {
      id: 'status',
      label: 'Status',
    },
    {
      id: 'user',
      label: 'User',
    },
    {
      id: 'date',
      label: 'Date',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'success';
      case 'in-progress':
        return 'default';
      case 'todo':
        return 'error';
      default:
        return 'primary';
    }
  };

  const createRow = (task: ITask) => {
    return {
      title: (
        <TaButton onClick={() => setTaskId(task.id)} variant='text'>
          {task.title}
        </TaButton>
      ),
      description: task.description,
      status: (
        <TaTypography variant='body1' color={getStatusColor(task.status)} component='span'>
          {task.status}
        </TaTypography>
      ),
      user: task.user?.username || '-',
      date: task.date,
    };
  };

  if (isLoading) {
    return <TaLoader open={true} />;
  }

  // Safe check for rows
  const tasks = (data as unknown as ITask[]) || [];
  const total = tasks.length;

  const rows = tasks.map(createRow);

  return (
    <TaStack direction='column' spacing={2}>
      <TaStack direction='row' justifyContent='space-between'>
        <TaSearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
        <TaButton variant='contained' onClick={() => setShowManageTaskForm(true)}>
          Create New Task
        </TaButton>
      </TaStack>

      <TaTable
        columns={columns}
        rows={rows}
        page={page}
        pageSize={pageSize}
        totalPages={total}
        setPage={setPage}
        setPageSize={setPageSize}
      />

      <TaManageTaskForm
        open={showManageTaskForm || !!taskId}
        onClose={() => {
          setShowManageTaskForm(false);
          setTaskId(undefined);
        }}
        taskId={taskId}
      />
    </TaStack>
  );
};
