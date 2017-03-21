//  Missing Active Authority gsteem
// copypaste from https://gist.github.com/tamr/5fb00a1c6214f5cab4f6
// (it have been modified: ий > iy and so on)
// this have been done beecause we cannot use special symbols in url (`` and '')
// and url seems to be the only source of thruth
var d = /\s+/g,
    //rus = "щ  ш   ч   ц   ю   ю   я   я  ые   ий  ё   ё   ж   ъ   э   ы   а   б   в   г   д   е   з   и   й   к   л   м   н   о   п   р   с   т   у   ф   х   х   ь".split(d),
    //eng = "sch    sh  ch  cz  yu  ju  ya  q  yie  iy  yo  jo  zh  w   ye  y   a   b   v   g   d   e   z   i   yi  k   l   m   n   o   p   r   s   t   u   f   x   h   j".split(d);

    rus = "щ    ш  ч  ц  й  ё  э  ю  я  х  ж  а б в г д е з и к л м н о п р с т у ф ъ  ы ь ґ є і ї".split(d),
    eng = "shch sh ch cz ij yo ye yu ya kh zh a b v g d e z i k l m n o p r s t u f xx y x g e i i".split(d);


module.exports.detransliterate = function(str, reverse) {
  if (!str) return str
    if (!reverse && str.substring(0, 4) !== 'ru--') return str
    if (!reverse) str = str.substring(4)

    // TODO rework this
    // (didnt placed this earlier because something is breaking and i am too lazy to figure it out ;( )
    if(!reverse) {
    //    str = str.replace(/j/g, 'ь')
    //    str = str.replace(/w/g, 'ъ')
        str = str.replace(/yie/g, 'ые')
    }
    else {
    //    str = str.replace(/ь/g, 'j')
    //    str = str.replace(/ъ/g, 'w')
        str = str.replace(/ые/g, 'yie')
    }

    var i,
        s = /[^[\]]+(?=])/g, orig = str.match(s),
        t = /<(.|\n)*?>/g, tags = str.match(t);

    if(reverse) {
        for(i = 0; i < rus.length; ++i) {
            str = str.split(rus[i]).join(eng[i]);
            str = str.split(rus[i].toUpperCase()).join(eng[i].toUpperCase());
        }
    }
    else {
        for(i = 0; i < rus.length; ++i) {
            str = str.split(eng[i]).join(rus[i]);
            str = str.split(eng[i].toUpperCase()).join(rus[i].toUpperCase());
        }
    }

    if(orig) {
        var restoreOrig = str.match(s);

        for (i = 0; i < restoreOrig.length; ++i)
            str = str.replace(restoreOrig[i], orig[i]);
    }

    if(tags) {
        var restoreTags = str.match(t);

        for (i = 0; i < restoreTags.length; ++i)
            str = str.replace(restoreTags[i], tags[i]);

        str = str.replace(/\[/g, '').replace(/\]/g, '');
    }

    return str;
}
