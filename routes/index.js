var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    const datas = [
            {
                title:'학교 공지사항', links: [{url: 'https://naver.com', title: '네이버'}, {url: 'https://daum.net', title: '다음'}, {url: 'https://google.com', title: '구글'}]
            },
            {
                title:'단과대 공지', links: [{url: 'https://naver.com', title: '네이버'}, {url: 'https://daum.net', title: '다음'}, {url: 'https://google.com', title: '구글'}]
            },
            {
                title:'학부 공지', links: [{url: 'https://naver.com', title: '네이버'}, {url: 'https://daum.net', title: '다음'}, {url: 'https://google.com', title: '구글'}]
            },
            {
                title:'푸쉬 받을 공지사항', links: [{url: 'https://naver.com', title: '네이버'}, {url: 'https://daum.net', title: '다음'}, {url: 'https://google.com', title: '구글'}]
            }
    ];

    const keywords = [
        {id: 0, title: '명월민속관'},
        {id: 1, title: '외부'},
        {id: 2, title: '홍보'}
    ]


    res.render('index', {title: 'KMULife', navbar: true, auth: false, user: {name: '강동호', number: 20163079}, results: datas, keywords: keywords});
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Login', navbar: false});
});

module.exports = router;
