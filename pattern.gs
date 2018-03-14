var players = [
  '相手', '自分'
];

var serviceHands = [
  'フォア', 'バック'
]

var servicePositions = [
  '右側', '左側'
];

var directionsX = [
  'バック', 'フォア', 'センター'
];

var directionsY = [
  'コート奥', 'ネット前', 'サイド'
];

var steps = [
  '近め', '普通', '遠目'
];

var conditions = [
  'チャンス', '追い込まれ', 'イーブン'
];

var speeds = [
  '早い', '遅い', '普通'
];

var fakes = [
  'なし', '少な目', '多め'
];

var themes = [
  '切れ目がない', '技術的な難易度を上げる', 'エネルギーを最大化する', '最小の力で動く', 'リズムを変える', '最大スピード'
];

var virtuals = [
  'Lee Chong Wei', 'Lin Dan', 'Chen Long', 'Wang Shixian', '山口茜', 'Lee Yong-dae', 'Lee Hyun-il', '張本'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function format(){
  var fmt = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {       
    var reg = new RegExp('\\{' + i + '\\}', 'gm');             
    fmt = fmt.replace(reg, arguments[i + 1]);
  }
  return fmt;
}

function getRandomRange(min, max) {
  return Math.floor( Math.random() * (max + 1 - min) ) + min ;
}

function getNextPlayer(player) {
  return player === '相手' ? '自分' : '相手';
}

function getOverviewText(overview){
  return format(
    '[全般]  テーマ: {0}   バランス: {1}   ステップ: {2}   スピード: {3}   フェイント: {4}   仮想敵: {5}    \n\n',
    overview.theme,
    overview.condition,
    overview.step,
    overview.speed,
    overview.fake,
    overview.virtual
  );    
}

function getService(player){
  return {
    player: player,
    serve: true,
    position: getRandomElement(servicePositions),
    hand: getRandomElement(serviceHands),
    directionX: getRandomElement(directionsX),
    directionY: getRandomElement(directionsY)
  };
}

function getServiceText(service) {
  return format(
    '[{0}のサーブ！]  開始地点: {1}   狙い: {2}   打ち方: {3}   \n',
    service.player,
    service.position,
    service.directionY + service.directionX,
    service.hand
  );
}

function getStroke(player, from){
  return {
    player: player,
    serve: false,
    from: from,
    directionX: getRandomElement(directionsX),
    directionY: getRandomElement(directionsY)
  };
}

function getStrokeText(stroke) {
  return format(
    '[{0}のストローク！]  開始: {1}    狙い: {2}   \n',
    stroke.player,
    stroke.from.y + stroke.from.x,
    stroke.directionY + stroke.directionX
  );
}

function getRally() {
  var server = getRandomElement(players);
  var service = getService(server);
  
  var rally = {
    strokes: [service]
  };
  var rallyCount = 6;
  
  var nextPosition = {x: service.directionX, y: service.directionY};
  var nextPlayer = getNextPlayer(server);
  for( var i = 0; i < rallyCount; i++ ) {
    var stroke = getStroke(nextPlayer, nextPosition);
    rally.strokes.push(stroke);
    nextPlayer = getNextPlayer(nextPlayer);
    nextPosition =  {x: stroke.directionX, y: stroke.directionY};
  }
  
  return rally;
  
}

function getRallyText(rally){
  var text = '';
  for(var j = 0; j < rally.strokes.length; j++){
    var stroke = rally.strokes[j];
    if(stroke.serve) {
      text += getServiceText(stroke);
    } else {
      text += getStrokeText(stroke);
    }
  } 
  return text;
}

function getRallies(){
  var ralliesCount = 4;
  var rallies = [];
  for(var i = 0; i < ralliesCount; i++) {
    rallies.push(getRally());
  }
  return rallies;
}

function getRalliesText(rallies) {

  var text = 
      getOverviewText({
        theme: getRandomElement(themes),
        condition: getRandomElement(conditions),
        step: getRandomElement(steps),
        speed: getRandomElement(speeds),
        fake: getRandomElement(fakes),
        virtual: getRandomElement(virtuals),
      });
  
  return rallies.reduce(function(acc, rally){
    return acc + getRallyText(rally) + '\n\n';
  }, text);

}

function getTodayString() {
  var date = new Date();
  var str = ''
  str += date.getFullYear() + "/";
  str += (date.getMonth() + 1) + '/';
  str += date.getDate();
  return str
}

function sendMail() {
  var rallies = getRallies();
  var text = getRalliesText(rallies);
  
  var to = 'my-email@gmail.com';
  var from = 'my-email@gmail.com';
  var sender = 'my-name';
  
  var today = new Date();
  var subject = format('今日の練習（{0}）', getTodayString());
  var body ='こんな練習はいかがでしょうか？\n' + text;
  
  GmailApp.sendEmail(
    to,
    subject,
    body,
    {
      from: from,
      name: sender
    }
  );
  
}