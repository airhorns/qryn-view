import { Column, RowData, Table } from '@tanstack/react-table'
import {Fragment, useMemo, FC} from 'react'
import { useTheme } from '../../../components/DataViews/components/QueryBuilder/hooks'
import DebouncedInput from './DebouncedInput'

type NumberInputProps = {
  columnFilterValue: [number, number]
  getFacetedMinMaxValues: () => [number, number] | undefined
  setFilterValue: (updater: any) => void
}

const NumberInput: React.FC<NumberInputProps> = ({
  columnFilterValue,
  getFacetedMinMaxValues,
  setFilterValue,
}) => {
  const theme = useTheme();
  const minOpt = getFacetedMinMaxValues()?.[0]
  const min = Number(minOpt ?? '')

  const maxOpt = getFacetedMinMaxValues()?.[1]
  const max = Number(maxOpt)

  return (
    <div>
      <div style={{display:'flex', gap:'4px', alignItems:'center', justifyContent:'center'}}>
        <DebouncedInput
          theme={theme}
          type="number"
          min={min}
          max={max}
          value={columnFilterValue?.[0] ?? ''}
          onChange={value =>
            setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${minOpt ? `(${min})` : ''}`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          theme={theme}
          type="number"
          min={min}
          max={max}
          value={columnFilterValue?.[1] ?? ''}
          onChange={value =>
            setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${maxOpt ? `(${max})` : ''}`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  )
}

type TextInputProps = {
  columnId: string
  columnFilterValue: string
  columnSize: number
  setFilterValue: (updater: any) => void
  sortedUniqueValues: any[]
}

const TextInput: FC<TextInputProps> = ({
  columnId,
  columnFilterValue,
  columnSize,
  setFilterValue,
  sortedUniqueValues,
}) => {
  const dataListId = columnId + 'list'
  const theme = useTheme();
  return (
    <Fragment>
      <datalist id={dataListId}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        theme={theme}
        type="text"
        value={columnFilterValue ?? ''}
        onChange={value => setFilterValue(value)}
        placeholder={`Search... (${columnSize})`}
        className="w-36 border shadow rounded"
        list={dataListId}
      />
      <div className="h-1" />
    </Fragment>
  )
}

type Props<T extends RowData> = {
  column: Column<T, unknown>
  table: Table<T>
}

export function Filter<T extends RowData>({ column, table }: Props<T>) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()
  const uniqueValues = column.getFacetedUniqueValues()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(uniqueValues.keys()).sort(),
          // eslint-disable-next-line react-hooks/exhaustive-deps
    [uniqueValues]
  )

  return typeof firstValue === 'number' ? (
    <NumberInput
      columnFilterValue={columnFilterValue as [number, number]}
      getFacetedMinMaxValues={column.getFacetedMinMaxValues}
      setFilterValue={column.setFilterValue}
    />
  ) : (
    <TextInput
      columnId={column.id}
      columnFilterValue={columnFilterValue as string}
      columnSize={uniqueValues.size}
      setFilterValue={column.setFilterValue}
      sortedUniqueValues={sortedUniqueValues}
    />
  )
}

export default Filter
