var express = require('express');
var router = express.Router();

var passport = require('passport');
var auth = require('../auth/auth-passport');

/* GET home page. */
router.get('/', auth.isAuthenticated, function (req, res, next) {
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


    res.render('index', {title: 'KMULife', navbar: true, auth: req.isAuthenticated(), user: {name: '강동호', number: 20163079}, results: datas, keywords: keywords});
});

router.get('/need_login', function (req, res, next) {
    res.render('index_need_login', {title: 'KMULife', navbar: true, auth: req.isAuthenticated()});
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Login', navbar: false});
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

//로그인
router.get('/popup/login', function (req, res, next) {
    res.render('login', {title: 'Login', navbar: false, auth: req.isAuthenticated()});
});

//포스트 로그인
router.post('/popup/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/popup/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.render('refresh');
        });
    })(req, res, next);
});

/*Log out*/
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect(req.headers.referer);
});

module.exports = router;
