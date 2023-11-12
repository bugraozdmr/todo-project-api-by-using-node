const searchHelper = (searchKey,query,req) => {
    if(req.query.search){
        const searchObject = {};
        // "i" küçük büyük duyarlılığı olmayacak
        const regex = new RegExp(req.query.search , "i");
        searchObject[searchKey] = regex;
        return query.where(searchObject);
    }
    return query;
};



const populateHelper = (query,population) => {
    return query.populate(population);

};


const questionSortHelper = (query,req) => {
    // başka alacak parametrem olmadığı için sadece tarihe göre sırala dedim
    
    return query.sort("-createdAt");
    

};

// user yada question bunu kullanabilir -- ondan model verildi
const paginationHelper = async(totalDocument,query,req) => {
    //* pagination
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    console.log(page,limit)
    // 1.sayfadaysak 0.indexten başlar -- 2.sayfadaysak 5.'den .....
    const startIndex = (page - 1)* limit;
    // sayfa sonu indexi
    const endIndex = page*limit;

    const pagination = {};
    // questins da eyw ama answer'da sayılamıyorlar çünkü question içinden yönlendiriliyorlar ondan total tanımlandı
    const total = totalDocument;

    //0'dan buyukse onceki safya vardır
    if(startIndex > 0){
        pagination.previous = {
            page : page - 1,
            limit : limit
        }
    }
    console.log("endindex",endIndex,"total",total)
    if(endIndex < total) {
        pagination.next = {
            page : page + 1,
            limit : limit
        }
    }

    // burdan dönen değerler elle slice işleminde kullanılacak startindex limit
    // iismler aynı ise direkt gider limit = limit gibi olur
    return {
        querry : query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination : pagination,
        startIndex,
        limit
    }
}

module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
};