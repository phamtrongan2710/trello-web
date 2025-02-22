import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Column title is required')
      return
    }

    // Tạo dữ liệu để gọi API tạo mới column
    const newColumnData = {
      title: newColumnTitle
    }

    // Gọi API tạo mới column và tạo mới state board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật lại state board
    // Cách thứ 2 nhanh hơn vì ít thao tác cấp phát bộ nhớ hơn

    // const newBoard = {
    //   ...board,
    //   columns: [...board.columns, createdColumn],
    //   columnsOrderIds: [...board.columnsOrderIds, createdColumn._id]
    // }

    /**
     * Lưu ý: FE phải tự làm đúng lại state của board thay vì phải gọi lại API fetchBoardDetailsAPI
     * Cách làm này phụ thuộc vào lựa chọn và đặc thù của dự án, có nơi thì BE sẽ hỗ trợ và trả về luôn toàn dữ liệu Board
     * dù đây là API tạo column hay card => FE nhàn hơn
     */

    /**
     * Đoạn này đang dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất của spread operator là shallow copy, nên dính phải rules Immutability trong redux toolkit không dùng được hàm push (sửa giá trị mảng trực tiếp), cách đơn giản và nhanh gọn nhất ở trường hợp này là chúng ta dùng tới deep copy/clone toàn bộ cái board cho dễ hiểu và code ngắn hơn
     * https://redux-toolkit.js.org/usage/immer-reducers#immutability-and-redux
     */
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    /**
     * Ngoài ra cách khác là dùng array.concat thay cho push như docs của redux toolkit ở trên vì push như đã nói nó sẽ thay đổi giá trị mảng trực tiếp, còn concat thì ghép mảng lại thành một mảng mới để chúng ta gán giá trị nên không không vấn đề gì
     */
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])

    // Cập nhật dữ liệu board vào trong redux store
    dispatch(updateCurrentActiveBoard(newBoard))

    // Đóng trạng thái thêm column mới và clear input
    toggleNewColumnForm()
    setNewColumnTitle('')
  }
  /**
   * The <SortableContext> component requires that you pass it the sorted array of the
   * unique identifiers associated to each sortable item via the items prop. This array
   * should look like ["1", "2", "3"], not [{id: "1"}, {id: "2}, {id: "3}].
   * If not, you can still drag and drop but there will be no animation.
   */
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        display: 'flex',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column =>
          <Column
            key={column._id}
            column={column}
          />)}

        {/* Box add new column */}
        {!openNewColumnForm
          ? <Box onClick={toggleNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button
              startIcon={<AddBoxIcon />}
              sx={{
                color: (theme) => theme.palette.primary.main,
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
              Add new column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                className="interceptor-loading"
                onClick={addNewColumn}
                variant="contained"
                color="success"
                type="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.light }
                }}
              >Add</Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleNewColumnForm}
              />
            </Box>
          </Box>
        }

      </Box>
    </SortableContext>
  )
}

export default ListColumns
