import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI,
  createNewCardAPI,
  createNewColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tạm thời gán cứng boardId
    const boardId = '67a3963c7fc4e7ceb018e44c'
    // call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      // sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Tạo card placeholder cho column không chứ cards
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  // Function này có nhiệm vụ gọi API tạo mới column và tạo mới state board
  const createNewColumn = async (newColumnData) => {
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
    const newBoard = { ...board }
    board.columns.push(createdColumn)
    board.columnOrderIds.push(createdColumn._id)

    setBoard(newBoard)
  }

  // Function này có nhiệm vụ gọi API tạo mới card và tạo mới state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật lại state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)

    if (columnToUpdate) {
      // Nếu column rỗng -> đang chứa 1 placeholder card
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]

      } else {
        // Column đã có data thì push vào cuối mảng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }
  // Function này có nhiệm vụ gọi API di chuyển column và tạo mới state board
  // Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứ nó
  const moveColumn = (dndOrderedColumns) => {
    // Cập nhật lại state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Di chuyển card trong một column
  // Chỉ cần gọi API cập nhật cardOrderIds của column chứa nó
  const moveCardInsideColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Cập nhật lại state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Gọi API update board
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /**
   * Khi di chuyển card sang column khác:
   * 1. Cập nhật cardOrderIds của Column ban đầu chưa nó (xóa _id khỏi mảng)
   * 2. Cập nhật cardOrderIds của Column tiếp theo (thêm _id vào mảng)
   * 3. Cập nhật lại columnId của card đã kéo
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Cập nhật lại state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lý
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // Column rỗng thì có placeholder card -> cần xóa trước khi đẩy dữ liệu về cho BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: ' center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress size="3rem" />
        <Typography>Loading board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumn={moveColumn}
        moveCardInsideColumn={moveCardInsideColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
