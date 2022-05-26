const title = 'Nonton Date A Live IV Subtitle Indonesia';
const arr = title.split(' ');
const data = arr.filter(e => e != 'Nonton' && e !== 'Subtitle' && e !== 'Indonesia')
console.log(data.join(' '))