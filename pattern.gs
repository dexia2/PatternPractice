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
  '1歩', '2歩', '3歩'
];

var positions = [
  '中央', '動かない', '逆'
]

var conditions = [
  'チャンス', '追い込まれ', 'イーブン'
];

var speeds = [
  '早い', '遅い', '普通'
];

var fakes = [
  'なし', 'あり'
];

var themes = [
  '切れ目がない', '技術的な難易度を上げる', 'エネルギーを最大化する', '最小の力で動く', 'リズムを変える', '最大スピード'
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

function getThemeText(theme){
  return format(
    '[テーマ]  ラリーのテーマは{0}です。\n',
    theme
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
    service.hand,
    service.directionY + service.directionX,
    service.position
  );
}

function getStroke(player, from){
  return {
    player: player,
    serve: false,
    from: from,
    directionX: getRandomElement(directionsX),
    directionY: getRandomElement(directionsY),
    condition: getRandomElement(conditions),
    step: getRandomElement(steps),
    speed: getRandomElement(speeds),
    fake: getRandomElement(fakes)
  };
}

function getStrokeText(stroke) {
  return format(
    '[{0}のストローク！]  開始: {1}    狙い: {2}   フェイント: {3}   バランス: {4}   ステップ: {5}   スピード: {6}    \n',
    stroke.player,
    stroke.from.y + stroke.from.x,
    stroke.directionY + stroke.directionX,
    stroke.fake,
    stroke.condition,
    stroke.step,
    stroke.speed
  );
}

function getRally() {
  var server = getRandomElement(players);
  var service = getService(server);
  
  var rally = {
    theme: getRandomElement(themes),
    strokes: [service]
  };
  var rallyCount = 5;
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
  var text = getThemeText(rally.theme);
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

function sendMail() {
  var rally = getRally();
  var text = getRallyText(rally);
  
  var to = 'my-email@gmail.com';
  var from = 'my-email@gmail.com';
  var sender = 'my-name';
  
  var subject = '今日の練習';
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

