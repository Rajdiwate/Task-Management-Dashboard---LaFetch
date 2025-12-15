import type { Meta, StoryObj } from '@storybook/react';
import { MaTable, type Column } from './MaTable';
import { Button, Chip } from '@mui/material';

// Sample data for the table
const columns: Column[] = [
  { id: 'name', label: 'Name' },
  { id: 'code', label: 'ISO\u2007Code' },
  {
    id: 'population',
    label: 'Population',
  },
  {
    id: 'size',
    label: 'Size\u00a0(km²)',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'actions',
    label: 'Actions',
  },
];

const createData = (
  name: string,
  code: string,
  population: number,
  size: number,
  status: 'active' | 'inactive' | 'pending',
) => {
  const density = population / size;
  return {
    name,
    code,
    population: population.toLocaleString(),
    size: size.toLocaleString(),
    density: density.toFixed(2),
    status,
    actions: (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <Button variant='outlined' size='small'>
          Edit
        </Button>
        <Button variant='outlined' color='error' size='small'>
          Delete
        </Button>
      </div>
    ),
  };
};

const rows = [
  createData('India', 'IN', 1324171354, 3287263, 'active'),
  createData('China', 'CN', 1403500365, 9596961, 'active'),
  createData('Italy', 'IT', 60483973, 301340, 'inactive'),
  createData('United States', 'US', 327167434, 9833520, 'pending'),
  createData('Canada', 'CA', 37602103, 9984670, 'active'),
];

const meta: Meta<typeof MaTable> = {
  title: 'Molecules/MaTable',
  component: MaTable,
  tags: ['autodocs'],
  argTypes: {
    stickyHeader: {
      control: 'boolean',
      description: 'Makes the header sticky',
    },
  },
};

export default meta;

type Story = StoryObj<typeof MaTable>;

export const Default: Story = {
  args: {
    columns: columns.filter((col) => !['status', 'actions'].includes(col.id)),
    rows: rows.map(({ ...rest }) => rest),
  },
};

export const WithReactComponents: Story = {
  args: {
    columns: [
      ...columns.filter((col) => !['status', 'actions'].includes(col.id)),
      {
        id: 'status',
        label: 'Status',
      },
      {
        id: 'actions',
        label: 'Actions',
      },
    ],
    rows: rows.map((row) => ({
      ...row,
      status: (
        <Chip
          label={row.status}
          color={
            row.status === 'active' ? 'success' : row.status === 'inactive' ? 'error' : 'warning'
          }
          size='small'
          variant='outlined'
        />
      ),
    })),
  },
};

export const WithStickyHeader: Story = {
  args: {
    columns: columns,
    rows: rows,
    stickyHeader: true,
    containerProps: { style: { maxHeight: 440 } },
  },
};

export const EmptyState: Story = {
  args: {
    columns,
    rows: [],
  },
};
