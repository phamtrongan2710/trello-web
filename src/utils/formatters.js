/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
  * FE sẽ tự tạo 1 card đặc biệt Placeholder card cho từng column, không liên quan BE
  * Card đặc biệt này bị ẩn khỏi giao diện UI người dùng
  * Cấu trúc id của cái card này để unique rất đơn giản, không cần random phức tạp: "columnId-placeholder-card"
  * Mỗi column chỉ có duy nhất 1 placeholder card
  * Note: Khi tạo phải đầy đủ {_id, boardId, columnId, FE_PlaceholderCard}
  */
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}