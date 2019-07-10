function readFromCSV(path) {
  let rawFile = new XMLHttpRequest();
  rawFile.open('GET', path, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        let allText = rawFile.responseText;
        raw = allText;
      }
    }
  };
  rawFile.send(null);
}

// battle --------------------------------------------------

let lstMember = new Array();
let parent = new Array();
let equal = new Array();
let rec = new Array();
let cmp1, cmp2;
let head1, head2;
let nrec;

let numQuestion;
let totalSize;
let finishSize;
let finishFlag;

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function initList() {
  let n = 0;
  let mid;
  let i;

  lstMember[n] = new Array();

  for (i = 0; i < moments.length; i++) {
    lstMember[n][i] = i;
  }

  parent[n] = -1;
  totalSize = 0;
  n++;

  for (i = 0; i < lstMember.length; i++) {
    if (lstMember[i].length >= 2) {
      mid = Math.ceil(lstMember[i].length / 2);
      lstMember[n] = new Array();
      lstMember[n] = lstMember[i].slice(0, mid);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
      lstMember[n] = new Array();
      lstMember[n] = lstMember[i].slice(mid, lstMember[i].length);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
    }
  }

  for (i = 0; i < moments.length; i++) {
    rec[i] = 0;
  }
  nrec = 0;

  for (i = 0; i <= moments.length; i++) {
    equal[i] = -1;
  }

  cmp1 = lstMember.length - 2;
  cmp2 = lstMember.length - 1;
  head1 = 0;
  head2 = 0;
  numQuestion = 1;
  finishSize = 0;
  finishFlag = 0;
}

function sortList(flag) {
  let i;
  let str;

  if (flag < 0) {
    rec[nrec] = lstMember[cmp1][head1];
    head1++;
    nrec++;
    finishSize++;

    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }

  } else if (flag > 0) {
    rec[nrec] = lstMember[cmp2][head2];
    head2++;
    nrec++;
    finishSize++;

    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }

  } else {
    rec[nrec] = lstMember[cmp1][head1];
    head1++;
    nrec++;
    finishSize++;

    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }

    equal[rec[nrec - 1]] = lstMember[cmp2][head2];
    rec[nrec] = lstMember[cmp2][head2];
    head2++;
    nrec++;
    finishSize++;

    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  }

  if (head1 < lstMember[cmp1].length && head2 == lstMember[cmp2].length) {
    while (head1 < lstMember[cmp1].length) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }

  } else if (head1 == lstMember[cmp1].length && head2 < lstMember[cmp2].length) {
    while (head2 < lstMember[cmp2].length) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  }

  if (head1 == lstMember[cmp1].length && head2 == lstMember[cmp2].length) {
    for (i = 0; i < lstMember[cmp1].length + lstMember[cmp2].length; i++) {
      lstMember[parent[cmp1]][i] = rec[i];
    }

    lstMember.pop();
    lstMember.pop();

    cmp1 = cmp1 - 2;
    cmp2 = cmp2 - 2;
    head1 = 0;
    head2 = 0;

    if (head1 == 0 && head2 == 0) {
      for (i = 0; i < moments.length; i++) {
        rec[i] = 0;
      }
      nrec = 0;
    }
  }

  if (cmp1 < 0) {
    str =
      '<b>Battle #' +
      (numQuestion - 1) +
      '<br>' +
      Math.floor((finishSize * 100) / totalSize) +
      '% sorted.</b>';
    document.getElementById('battleNumber').innerHTML = str;
    showResult();
    finishFlag = 1;
  } else {
    showImage();
  }
}

function showResult() {
  let ranking = 1;
  let sameRank = 1;
  let str = '';
  let i;

  str += '<table id="resultTable" align="center">';
  str += '<tr><td class="resultHeader"><b>Rank</b></td><td class="resultHeader"><b>Options</b></td></tr>';

  for (i = 0; i < moments.length; i++) {
    str +=
      '<tr><td style="border:1px solid #ff886c; text-align:center; padding-right:5px;">' +
      ranking +
      '</td><td style="border:1px solid #ff886c; padding-left:5px;">' +
      moments[lstMember[0][i]] +
      '</td></tr>';
    if (i < moments.length - 1) {
      if (equal[lstMember[0][i]] == lstMember[0][i + 1]) {
        sameRank++;
      } else {
        ranking += sameRank;
        sameRank = 1;
      }
    }
  }

  str += '</table>';
  document.getElementById('resultField').innerHTML = str;
}

function showImage() {
  let str0 =
    '<b>Battle #' + numQuestion + '<br>' + Math.floor((finishSize * 100) / totalSize) + '% sorted.</b>';
  let str1 = '' + toNameFace(lstMember[cmp1][head1]);
  let str2 = '' + toNameFace(lstMember[cmp2][head2]);

  document.getElementById('battleNumber').innerHTML = str0;
  document.getElementById('leftField').innerHTML = str1;
  document.getElementById('rightField').innerHTML = str2;

  numQuestion++;
}

function toNameFace(n) {
  let str = moments[n];
  return str;
}

// --------------------------------------------------

// search filter --------------------------------------------------

function filterMoments(event) {
  let filterText = event.target.value.toLowerCase();
  filteredMoments = choices.filter(function(choice) {
    return choice.name.toLowerCase().includes(filterText);
  });
  rerenderTable();
}

function rerenderTable() {
  let list = document.getElementById('filter');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  populateList(filteredMoments);
}

function populateList(choices) {
  let table = document.getElementById('filter');
  for (let i = 0; i < choices.length; i++) {
    const links = choices[i].links.split("|");
    let linksEntry = "</br>";
    for (let j = 0; j < links.length; j++) {
      let even = j % 2 === 0 ? '' : 'even';
      if (links[j] !== "") {
        linksEntry += `<a class="link ${even}" href="${links[j]}" target="_blank" rel="noopener noreferrer">Link ${j+1}</a>   `;
      }
    }
    const entry = `<li class="list-group-item">${choices[i].name}${linksEntry}</li>`;
    table.insertAdjacentHTML('beforeend', entry);
  }
}

// --------------------------------------------------

let filteredMoments = [];
let raw = '';
readFromCSV('./assets/choices.csv');
const choices = $.csv.toObjects(raw);
populateList(choices);
let moments = choices.map(function (moment, index) {
  return moment.name;
})
moments = shuffle(moments);
initList();
showImage();