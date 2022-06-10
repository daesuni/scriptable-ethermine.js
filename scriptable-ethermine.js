// ENTER YOUT MINING ADDRESS
const address = '0x52b12468f593b8ce5ef3a2f3c1745a8adf9d4f6d'

// CONFIG
const data = await getEthermineInfo(address)
const coinImgSrc = new Request('https://www.pngall.com/wp-content/uploads/10/Ethereum-Logo-PNG-Image-HD.png')
const coinImg = await coinImgSrc.loadImage()
const progressWidth = 280
const progressHeight = 1
const progressBackColor = new Color('#fff', 0.2)
const progressFillColor = Color.orange()

// script
let widget = createWidget(data, coinImg)
if (config.runsInWidget) {
    Script.setWidget(widget)
    Script.complete()
} else {
    widget.presentMedium()
}

// widget
function createWidget(data, coinImg) {

    let w = new ListWidget()
    w.backgroundColor = new Color('#141b2f')

    // container
    let container = w.addStack()
    container.layoutVertically()
    container.addSpacer()

    // mid row
    let midRow = container.addStack()
    midRow.layoutHorizontally()
    midRow.centerAlignContent()

    // hash col
    let hashCol = midRow.addStack()
    hashCol.layoutVertically()
    hashCol.centerAlignContent()
    let hashLbl = hashCol.addText('Hashrate')
    hashLbl.textColor = new Color('#8a92b2')
    hashLbl.font = Font.systemFont(13)
    hashCol.addSpacer(3)
    let hashCntnt = hashCol.addStack()
    hashCntnt.layoutHorizontally()
    hashCntnt.bottomAlignContent()
    let hashVal = hashCntnt.addText(data.reportedHashrate.toFixed(2))
    hashVal.textColor = Color.orange()
    hashVal.font = Font.systemFont(24)

    // unpaid col
    midRow.addSpacer()
    let unpaidCol = midRow.addStack()
    unpaidCol.layoutVertically()
    unpaidCol.centerAlignContent()
    let unpaidLbl = unpaidCol.addText('Unpaid Balance')
    unpaidLbl.textColor = new Color('#8a92b2')
    unpaidLbl.font = Font.systemFont(13)
    unpaidCol.addSpacer(3)
    let unpaidCntnt = unpaidCol.addStack()
    unpaidCntnt.layoutHorizontally()
    unpaidCntnt.bottomAlignContent()
    let unpaidVal = unpaidCntnt.addText(data.unpaid.toFixed(5))
    unpaidVal.textColor = Color.orange()
    unpaidVal.font = Font.systemFont(24)

    // worker col
    midRow.addSpacer()
    let workerCol = midRow.addStack()
    workerCol.layoutVertically()
    workerCol.centerAlignContent()
    let workerLbl = workerCol.addText('Workers')
    workerLbl.textColor = new Color('#8a92b2')
    workerLbl.font = Font.systemFont(13)
    workerLbl.centerAlignText()
    workerCol.addSpacer(3)
    let workerCntnt = workerCol.addStack()
    workerCntnt.layoutHorizontally()
    workerCntnt.bottomAlignContent()
    let workerVal = workerCntnt.addText(data.activeWorkers + '' || 0)
    workerVal.textColor = Color.orange()
    workerVal.font = Font.systemFont(24)

    // bot row
    container.addSpacer(10)
    let botRow = container.addStack()
    botRow.layoutVertically()
    
	// eran col
    let earnCol = botRow.addStack()
    earnCol.layoutHorizontally()
    earnCol.centerAlignContent()
    let earnLbl = earnCol.addText('Daily Earning')
    earnLbl.textColor = new Color('#8a92b2')
    earnLbl.font = Font.systemFont(13)
    earnCol.addSpacer()
    let earnCntnt = earnCol.addStack()
    earnCntnt.layoutHorizontally()
    earnCntnt.bottomAlignContent()
    let earnVal = earnCntnt.addText(data.dailyEarning.toFixed(5))
    earnVal.textColor = Color.white()
    earnVal.font = Font.systemFont(13)

	// next pay col
    botRow.addSpacer(3)
    let nextPayCol = botRow.addStack()
    nextPayCol.layoutHorizontally()
    nextPayCol.centerAlignContent()
    let nextPayLbl = nextPayCol.addText('Next Payout')
    nextPayLbl.textColor = new Color('#8a92b2')
    nextPayLbl.font = Font.systemFont(13)
    nextPayCol.addSpacer()
    let nextPayCntnt = nextPayCol.addStack()
    nextPayCntnt.layoutHorizontally()
    nextPayCntnt.bottomAlignContent()
    let nextPayVal = nextPayCntnt.addText(data.nextPayout.toLocaleString())
    nextPayVal.textColor = Color.white()
    nextPayVal.font = Font.systemFont(13)

	// next pct col
    botRow.addSpacer(3)
    let nextPctCol = botRow.addStack()
    nextPctCol.layoutHorizontally()
    nextPctCol.centerAlignContent()
    let nextPctLbl = nextPctCol.addText('Threshold')
    nextPctLbl.textColor = new Color('#8a92b2')
    nextPctLbl.font = Font.systemFont(13)
    nextPctCol.addSpacer()
    let nextPctCntnt = nextPctCol.addStack()
    nextPctCntnt.layoutHorizontally()
    nextPctCntnt.bottomAlignContent()
    let nextPctVal = nextPctCntnt.addText(data.payoutPct.toFixed(1) + '%')
    nextPctVal.textColor = Color.orange()
    nextPctVal.font = Font.systemFont(13)
    let nextPctSuf = nextPctCntnt.addText(' of ' + data.minPayoutEth)
    nextPctSuf.textColor = Color.white()
    nextPctSuf.font = Font.systemFont(13)
    
    // prog row
    container.addSpacer(3)
    let prgRow = container.addStack()
    prgRow.layoutHorizontally()
    prgRow.centerAlignContent()
    let progressbar = prgRow.addImage(createProgress(data.payoutPct.toFixed(0)))
    progressbar.imageSize = new Size(progressWidth, progressHeight)

    container.addSpacer()
    w.setPadding(20, 25, 20, 25)
    return w
}

function createProgress(percent) {
    const context = new DrawContext()
    context.size = new Size(progressWidth, progressHeight)
    context.opaque = false
    context.respectScreenScale = true

    // Background Path
    context.setFillColor(progressBackColor)
    let path = new Path()
    path.addRect(new Rect(0, 0, progressWidth, progressHeight))
    context.addPath(path)
    context.fillPath()

    // Progress Path
    context.setFillColor(progressFillColor)  
    path = new Path()
    const pathWidth = (progressWidth * (percent / 100) > progressWidth) ? progressWidth : progressWidth * (percent / 100)
    path.addRect(new Rect(0, 0, pathWidth, progressHeight))
    context.addPath(path)
    context.fillPath()
    return context.getImage()
}

async function getEthermineInfo(address) {
    const statUrl = 'https://api.ethermine.org/miner/' + address + '/currentStats'
    const statReq = new Request(statUrl)
    const statRes = await statReq.loadJSON() 
    const settingUrl = 'https://api.ethermine.org/miner/' + address + '/settings'
    const settingReq = new Request(settingUrl)
    const settingRes = await settingReq.loadJSON()
    const result = statRes.data
    result.minPayout = settingRes.data.minPayout;
    result.minPayoutEth = result.minPayout / 1000000000000000000
    result.unpaid = result.unpaid / 1000000000000000000
    result.payoutPct = result.unpaid / result.minPayout * 100000000000000000000
    const nextPayoutMinutes = ((result.minPayout / 1000000000000000000) - result.unpaid) / result.coinsPerMin
    result.nextPayout = new Date(new Date().getTime() + (nextPayoutMinutes * 60000))
    result.dailyEarning = result.coinsPerMin * (60 * 24)
    result.montlyEarning = result.coinsPerMin * (60 * 24 * 30)
    result.yearlyEarning = result.coinsPerMin * (60 * 24 * 30 * 12)
    result.reportedHashrate = result.reportedHashrate / 1000000
    return result
}
