class StringUtils{
    static getSlugFromCateLink(link){
        let startIndex = link.indexOf('/the-loai/') + '/the-loai/'.length;
        return link.substring(startIndex, link.length - 1);
    }
}

module.exports = StringUtils;