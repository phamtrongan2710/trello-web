import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function Board() {
  const dispatch = useDispatch()
  // không dùng state của component nữa mà chuyển qua dùng state của redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  const activeCard = useSelector(selectCurrentActiveCard)

  const { boardId } = useParams()

  useEffect(() => {
    // tạm thời gán cứng boardId
    // const boardId = '67a3963c7fc4e7ceb018e44c'
    // call API
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // Function này có nhiệm vụ gọi API di chuyển column và tạo mới state board
  // Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứ nó
  const moveColumn = dndOrderedColumns => {
    // Cập nhật lại state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    /**
     * Trường hợp này dùng spread operator thì không sao bởi vì ở đây chúng ta không dùng push như ở trên khiến mảng bị thay đổi giá trị trực tiếp
     * Ở đây gán lại mảng toàn bộ giá trị columns và columnOrderIds bẳng 2 mảng mới (tương tự concat)
     */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API update board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  // Di chuyển card trong một column
  // Chỉ cần gọi API cập nhật cardOrderIds của column chứa nó
  const moveCardInsideColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // Cập nhật lại state board
    /**
     * Error: Cannot assign to read only property 'cards'
     * Trường hợp immutablity ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc (read only - nested object - can thiệp sâu dữ liệu)
     */
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(
      column => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API update board
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /**
   * Khi di chuyển card sang column khác:
   * 1. Cập nhật cardOrderIds của Column ban đầu chưa nó (xóa _id khỏi mảng)
   * 2. Cập nhật cardOrderIds của Column tiếp theo (thêm _id vào mảng)
   * 3. Cập nhật lại columnId của card đã kéo
   */
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    // Cập nhật lại state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    // Tương tự đoạn xử lý moveColumn bên trên nên không ảnh hưởng Redux toolkit Immutability
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API xử lý
    let prevCardOrderIds = dndOrderedColumns.find(
      c => c._id === prevColumnId
    )?.cardOrderIds
    // Column rỗng thì có placeholder card -> cần xóa trước khi đẩy dữ liệu về cho BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)
        ?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading board..." />
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/** Modal active card: check đóng/mở dựa theo điều kiện có tồn tại data activeCard lưu trong Redux hay không thì mới rendẻ. Mỗi thời điểm chỉ tồn tại một cái modal active card đang active */}
      {activeCard && <ActiveCard />}

      {/** Các thành phần còn lại của board detail */}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        // 3 trường hợp move ở đây thì giữ nguyên để code xử lý kéo thả ở phần BoardContent không bị quá dài khi đọc code, maintain
        moveColumn={moveColumn}
        moveCardInsideColumn={moveCardInsideColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
