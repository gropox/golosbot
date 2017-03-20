

let permlink = "re-ukrainian-re-ropox-re-ukrainian-re-redhat-chto-za-nelepyi-pamp-20170318t183444946z";
let permpath = permlink.split("re-");
let root = permpath[permpath.length-1];
root = root.replace(/[0-9]{8}t[0-9]{6}.*z$/, "");
console.log(root);

