const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
const { ensureAuthenticated } = require('../custom_modules/auth');
const { googleRickjwApiKey } = require('../config/keys');
const Org = require('../models/Org');

router.post('/orgs/search', ensureAuthenticated, (req, res) => {
    Org
        .find({ $or: [ { name: req.body.search.toLowerCase() },
            { type: req.body.search.toLowerCase() },
            { url: req.body.search.toLowerCase() } ] }, (err, org) => {
            if (err) {
                req.flash('warning_message', err.message);
                res.redirect('/user/dashboard');
            }
            
            if(org.length) {
                res.render('user/dashboard', { title: 'Dashboard', org: org, hasOrgs: true, searched: true });
            } else {
                req.flash('warning_message', 'No Results');
                res.redirect('/user/dashboard');
            }
        })
        .where({ user: req.user._id });
});

router.get('/orgs/org/:id', ensureAuthenticated, async(req, res) => {
    const id = req.params.id;
    try {
        await Org.findOne({ _id: id }, (err,org) => {
            if (err) {
                res.redirect('/user/dashboard');
            }
            res.render('user/dashboard', { title: org.name, hasOrg: true, org:org });
        })
        .where({ user: req.user._id });
    } catch(err) {
        res.redirect('user/dashboard');
    }
});

router.post('/orgs/org/edit/:id', ensureAuthenticated, (req, res) => {
    const form = req.body;
    const upOrg = {};
    upOrg.name = form.name;
    upOrg.type = form.type;
    upOrg.user = req.user._id;

    if (form.url) {
        upOrg.url = form.url;
    }

    if (form.phone) {
        upOrg.phone = form.phone;
    }

    if (form.email) {
        upOrg.email = form.email;
    }

    if (form.loginName) {
        upOrg.loginName = form.loginName;
    }

    if (form.loginPassword) {
        upOrg.loginPassword = form.loginPassword;
    }

    if (form.street || 
        form.city || 
        form.state || 
        form.zipcode || 
        form.country) {
            upOrg.address = {};

        if (form.street) {
            upOrg.address.street = form.street;
        }

        if (form.city) {
            upOrg.address.city = form.city;
        }

        if (form.state) {
            upOrg.address.state = form.state;
        }

        if (form.zipcode) {
            upOrg.address.zipcode = form.zipcode;
        }

        if (form.country) {
            upOrg.address.country = form.country;
        }
    }

    Org.findOneAndUpdate({ _id: form.id }, upOrg, (err, org) => {
        if (err) {
            res.redirect('/user/dashboard');
        }

        res.redirect('/user/dashboard');
    })
    .where({ user: req.user._id });
    
});

router.post('/orgs', ensureAuthenticated, async (req, res) => {
    const newOrg = {};
    newOrg.name = req.body.name.toLowerCase();
    newOrg.type = req.body.type.toLowerCase();
    newOrg.user = req.user._id;

    if (req.body.url) {
        newOrg.url = req.body.url.toLowerCase();
    }

    if (req.body.phone) {
        newOrg.phone = req.body.phone;
    }

    if (req.body.email) {
        newOrg.email = req.body.email.toLowerCase();
    }

    if (req.body.loginName) {
        newOrg.loginName = req.body.loginName.toLowerCase();
    }

    if (req.body.loginPassword) {
        newOrg.loginPassword = req.body.loginPassword;
    }

    if (req.body.street || 
        req.body.city || 
        req.body.state || 
        req.body.zipcode || 
        req.body.country) {
        newOrg.address = {};

        if (req.body.street) {
            newOrg.address.street = req.body.street.toLowerCase();
        }

        if (req.body.city) {
            newOrg.address.city = req.body.city.toLowerCase();
        }

        if (req.body.state) {
            newOrg.address.state = req.body.state.toLowerCase();
        }

        if (req.body.zipcode) {
            newOrg.address.zipcode = req.body.zipcode;
        }

        if (req.body.country) {
            newOrg.address.country = req.body.country.toLowerCase();
        }
    }
    
    try {
        const nOrg = new Org(newOrg);
        await nOrg.save((err, no)=>{
            if (err) {
                req.flash('error_message', err.message);
            }
            console.log(no);
            res.redirect('/user/dashboard');
        });
    } catch(err) {
        req.flash('error_message', err.message);
        res.redirect('/user/dashboard');
    }
});

router.get('/orgs/org/delete/:id', ensureAuthenticated, (req, res) => {
    Org.findOneAndDelete({_id: req.params.id},(err, org) => {
        if (err) {
            throw err;
        }
        res.redirect('/user/dashboard');
    })
    .where({ user: req.user._id });
});

// Search View
router.get('/youtube/search', ensureAuthenticated, (req, res) => {
    res.render('user/youtube', { title: `YouTube`, mTitle: `Search YouTube`, sTitle: `YouTube Search` });
});

// Search Submit
router.post('/youtube/search', ensureAuthenticated, (req, res) => {
    const term = req.body.term;

    // initialize the Youtube API library
    const youtube = google.youtube({
        version: 'v3',
        auth: googleRickjwApiKey
    });
            
    youtube.search.list({
        q: `${term}`,
        part: 'snippet',
        type: 'video',
        maxResults: (req.body.maxResults || 50),
        order: 'date',
        safeSearch: 'moderate'
    })
        .then(data => {          
            const {
                videos,
                hasVideos,
                hasVideo,
                hasNoVideo,
                initVideo
            } = extractData(data);
            
            res.render('user/youtube', {
                title: term,
                videoSearched: true,
                videos,
                hasVideos,
                hasVideo,
                hasNoVideo                
            });
        })
        .catch(err => {
            req.flash('info_message', err.message);
            console.log(`\n\t\tError\n\t${err.message}\n\n`);
            res.redirect('/api/youtube/search');
        });

});

module.exports = router;

function extractData(data) {
    const videos = data.data.items;
    const hasVideos = (data.data.items.length > 1);
    const hasVideo = (Object.keys(data.data.items).length == 1);
    const hasNoVideo = (Object.keys(data.data.items).length == 0);
    const initVideo = (hasVideos > 0) ? data.data.items[0] : null;
    return {
        videos,
        hasVideos,
        hasVideo,
        hasNoVideo,
        initVideo
    };
}

function truncate (str, len) {
    if (str.length > len && str.length > 0) {
        var new_str = str + " ";
        new_str = str.substr(0, len);
        new_str = str.substr(0, new_str.lastIndexOf(" "));
        new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
        return new_str + ' ...';
    }
    return str;
}
