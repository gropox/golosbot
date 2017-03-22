module.exports = function CurationReward(opBody) {
    
    Object.assign(this, opBody);
    
    this.isMine = function (userid) {
        return userid == this.curator;
    }
    
    this.isCommentMine = function (userid) {
        return userid == this.comment_author;
    }

}
