export function useFormatTimestamp(timestamp) {
	const date = new Date(timestamp)

	// Получаем дату: dd.mm.yyyy
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
	const year = date.getFullYear()
	const formattedDate = `${day}.${month}.${year}`

	// Получаем время: hh:mm
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const formattedTime = `${hours}:${minutes}`

	return {
		date: formattedDate,
		time: formattedTime,
	}
}
