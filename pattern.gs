var players = [
  '����', '����'
];

var serviceHands = [
  '�t�H�A', '�o�b�N'
]

var servicePositions = [
  '�E��', '����'
];

var directionsX = [
  '�o�b�N', '�t�H�A', '�Z���^�['
];

var directionsY = [
  '�R�[�g��', '�l�b�g�O', '�T�C�h'
];

var steps = [
  '1��', '2��', '3��'
];

var positions = [
  '����', '�����Ȃ�', '�t'
];

var conditions = [
  '�`�����X', '�ǂ����܂�', '�C�[�u��'
];

var speeds = [
  '����', '�x��', '����'
];

var fakes = [
  '�Ȃ�', '���Ȗ�', '����'
];

var themes = [
  '�؂�ڂ��Ȃ�', '�Z�p�I�ȓ�Փx���グ��', '�G�l���M�[���ő剻����', '�ŏ��̗͂œ���', '���Y����ς���', '�ő�X�s�[�h'
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
  return player === '����' ? '����' : '����';
}

function getOverviewText(rally){
  return format(
    '[�S��]  �e�[�}: {0}   �o�����X: {1}   �X�e�b�v: {2}   �X�s�[�h: {3}   �t�F�C���g: {4}   \n',
    rally.theme,
    rally.condition,
    rally.step,
    rally.speed,
    rally.fake
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
    '[{0}�̃T�[�u�I]  �J�n�n�_: {1}   �_��: {2}   �ł���: {3}   \n',
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
    '[{0}�̃X�g���[�N�I]  �J�n: {1}    �_��: {2}   \n',
    stroke.player,
    stroke.from.y + stroke.from.x,
    stroke.directionY + stroke.directionX
  );
}

function getRally() {
  var server = getRandomElement(players);
  var service = getService(server);
  
  var rally = {
    theme: getRandomElement(themes),
    condition: getRandomElement(conditions),
    step: getRandomElement(steps),
    speed: getRandomElement(speeds),
    fake: getRandomElement(fakes),
    strokes: [service],
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
  var text = getOverviewText(rally);
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

function getTodayString() {
  var date = new Date();
  var str = ''
  str += date.getFullYear() + "/";
  str += (date.getMonth() + 1) + '/';
  str += date.getDate();
  return str
}

function sendMail() {
  var rally = getRally();
  var text = getRallyText(rally);
  
  var to = 'my-email@gmail.com';
  var from = 'my-email@gmail.com';
  var sender = 'my-name';
  
  var today = new Date();
  var subject = format('�����̗��K�i{0}�j', getTodayString());
  var body ='����ȗ��K�͂������ł��傤���H\n' + text;
  
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