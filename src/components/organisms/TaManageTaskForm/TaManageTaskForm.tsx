import { TaButton, TaStack, TaTypography } from '@/components/atoms';
import { USER_ROLE } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@mui/material';
import { useForm } from 'react-hook-form';
import { TaManageTaskFormSchema } from './TaManageTaskForm.schema';
import { TaFormSelectField, TaFormTextField } from '@/components/molecules';
import {
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useEditTaskByIdMutation,
} from '@/store/taskApi/taskApi';
import { useEffect } from 'react';
import { useGetUserQuery, useGetAllUsersQuery } from '@/store/userApi/userApi';
import { toast } from 'react-toastify';
import type { User } from '@/store/userApi/userApi.types';
import styles from './TaManageTaskForm.module.scss';

interface TaManageTaskFormProps {
  open: boolean;
  onClose: () => void;
  taskId?: string;
}

export const TaManageTaskForm = ({ open, onClose, taskId }: TaManageTaskFormProps) => {
  const { data: task } = useGetTaskByIdQuery(taskId || '', {
    skip: !taskId,
  });

  const { data: currentUser } = useGetUserQuery();
  const { data: users } = useGetAllUsersQuery();
  const userOptions = users?.map((u) => ({ value: u.username, label: u.username })) || [];

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [editTask, { isLoading: isEditing }] = useEditTaskByIdMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaManageTaskFormSchema>({
    resolver: zodResolver(TaManageTaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      user: '',
    },
  });

  useEffect(() => {
    if (task && taskId) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status as 'todo' | 'in-progress' | 'done',
        user: task.user?.username || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'todo',
        user: '',
      });
    }
  }, [task, taskId, reset, open]); // Added taskId to dep array to be safe, though open/task change handles most.

  const isAdmin = currentUser?.roleName === USER_ROLE.ADMIN;
  const isEditingTask = !!taskId;
  // If creating, allow editing. If editing, only allow if admin.
  // The user request says: "If the currentUser role is "admin" , then only allow to edit all fields or else he can only update the status"
  // This implies if !admin and isEditingTask, fields are disabled.
  const canEditDetails = !isEditingTask || isAdmin;

  const onSubmit = async (data: TaManageTaskFormSchema) => {
    try {
      const selectedUser = users?.find((u) => u.username === data.user);

      if (taskId) {
        await editTask({
          id: taskId,
          data: {
            ...data,
            user: selectedUser as User,
          },
        }).unwrap();
        toast.success('Task updated successfully');
      } else {
        await createTask({
          ...data,
          date: new Date().toISOString().split('T')[0],
          user: selectedUser || currentUser,
        }).unwrap();
        toast.success('Task created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save task');
      console.error(error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TaStack className={styles['manage-task-form']} direction='column' spacing={2}>
          <TaTypography variant='h1' component='h2' align='center'>
            {isEditingTask ? 'Edit Task' : 'Create Task'}
          </TaTypography>

          <TaFormTextField
            name='title'
            control={control}
            label='Title'
            id='title'
            dataTestId='title'
            errors={errors}
            disabled={!canEditDetails}
          />

          <TaFormTextField
            name='description'
            control={control}
            label='Description'
            id='description'
            dataTestId='description'
            errors={errors}
            disabled={!canEditDetails}
          />

          <TaFormSelectField
            name='status'
            control={control}
            label='Status'
            id='status'
            dataTestId='status'
            errors={errors}
            options={[
              { value: 'todo', label: 'Todo' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'done', label: 'Done' },
            ]}
          />

          <TaFormSelectField
            name='user'
            control={control}
            label='User'
            id='user'
            dataTestId='user'
            errors={errors}
            options={userOptions}
            disabled={!canEditDetails}
          />

          <TaButton type='submit' loading={isCreating || isEditing}>
            Submit
          </TaButton>
        </TaStack>
      </form>
    </Modal>
  );
};
