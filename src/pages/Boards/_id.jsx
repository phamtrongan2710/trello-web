import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tạm thời gán cứng boardId
    const boardId = '67a3963c7fc4e7ceb018e44c'
    // call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns.forEach(column => {
        // Tạo card placeholder cho column không chứ cards
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
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
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
