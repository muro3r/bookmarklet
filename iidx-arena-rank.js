/**
 * ブックマークのURLを以下で登録してアリーナクラス TOP RANKER RANKING のページで実行してください。
 * javascript:(function(url)%7Blet%20s=document.createElement('script');s.src=url;s.type='text/javascript';document.head.appendChild(s)%7D('https://muro3r.github.io/bookmarklet/iidx-arena-rank.js'))
 */

'use strict'
async function fetchMyDJData () {
  const res = await fetch('https://p.eagate.573.jp/game/2dx/28/djdata/status.html')
  const body = await res.arrayBuffer()
  const textDecoder = new TextDecoder('Windows-31J')
  const statusPage = new DOMParser().parseFromString(textDecoder.decode(body), 'text/html')
  const statusArray = statusPage.querySelectorAll('div.dj-profile > table > tbody > tr > td:nth-child(2)')
  const data = [...statusArray].map((elem) => elem.textContent)
  return {
    name: data[0],
    area: data[1],
    id: data[2],
    mog: Number(data[3]),
    playCount: data[4]
  }
}
function findMyArenaData (djData, arenaList) {
  let localAreaRank
  return {
    ...arenaList
      .filter(({ area }) => area === djData.area)
      .find((value, index) => {
        if (value.id === djData.id) {
          localAreaRank = index + 1
          return { ...value }
        }
      }),
    localAreaRank
  }
}
function displayArenaRank (djData, arenaInfo) {
  const basicProfile = `DJ NAME ${djData.name}\n` +
    `所属エリア ${djData.area}\n` +
    `IIDX ID ${djData.id}\n\n`
  const rankingFormat = (arenaInfo) => `順位 ${arenaInfo.rank}位\n` +
    `${arenaInfo.area} ${arenaInfo.localAreaRank}位\n` +
    `アリーナクラス ${arenaInfo.arena_class?.toUpperCase()}\n` +
    `${arenaInfo.arena_class === 'a1'
      ? 'A1連続維持回数 ' + arenaInfo.contine
      : ''}`
  let result = basicProfile
  const playStyle = ['SP', 'DP']
  for (let i = 0; i < 2; i++) {
    result += `[${playStyle[i]}]\n`
    if (!arenaInfo[i].localAreaRank) {
      result += 'データが見つかりませんでした。\n\n'
      continue
    }
    result += rankingFormat(arenaInfo[i]) + '\n'
  }
  alert(result)
}
;
(async () => {
  const djData = await fetchMyDJData()
  const result = []
  const retData = [ret_data.list, ret_data1.list]
  for (const list of retData) {
    result.push(findMyArenaData(djData, list))
  }
  displayArenaRank(djData, result)
})()
