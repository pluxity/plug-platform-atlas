/**
 * SVG 아이콘의 색상을 변경하는 유틸리티 함수
 */

/**
 * SVG 문자열에서 fill과 stroke 색상을 모두 변경합니다.
 * @param svgString - 원본 SVG 문자열
 * @param fillColor - 변경할 fill 색상
 * @param strokeColor - 변경할 stroke 색상 (선택사항)
 * @returns 색상이 변경된 SVG 문자열
 */
export const replaceSvgColors = (
  svgString: string,
  fillColor: string,
  strokeColor?: string
): string => {
  // fill 속성이 있는 path, circle, rect 등의 요소의 색상을 변경
  let result = svgString.replace(/fill="[^"]*"/g, `fill="${fillColor}"`)
  if (strokeColor) {
    result = result.replace(/stroke="[^"]*"/g, `stroke="${strokeColor}"`)
  }
  return result
}

/**
 * SVG 파일을 fetch하여 문자열로 반환합니다.
 * @param path - SVG 파일 경로
 * @returns SVG 문자열
 */
export const fetchSvg = async (path: string): Promise<string> => {
  try {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.statusText}`)
    }
    return await response.text()
  } catch (error) {
    console.error(`Error fetching SVG from ${path}:`, error)
    throw error
  }
}

