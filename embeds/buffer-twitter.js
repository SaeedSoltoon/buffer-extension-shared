;(function() {

    // Only run this script on twitter:
    if ( window.location.host.indexOf('twitter.com') === -1 ) return;

    $('head').append([
        '<style>',
            // To shrink the composer buttons to fit on one line
            '.tweet-button.buffer-inserted {',
                'margin-top: 3px;',
            '}',
            '.tweet-button.buffer-inserted .btn {',
                'padding: 7px 8px 6px;',
            '}',
            '.tweet-button.buffer-inserted .tweet-counter {',
                'width: auto;',
            '}',
            '.tweet-box-extras .geo-picker {',
                'margin-right: 0px;',
            '}',
            // For the twitter stream:
            '.tweet .action-buffer-container span.icon, ',
            '.tweet.opened-tweet .action-buffer-container span.icon, ',
            '.tweet.opened-tweet.hover .action-buffer-container span.icon {',
                'background-position: -3px -3px !important;',
            '}',
            '.tweet:hover .action-buffer-container span.icon {',
                'background-position: -3px  -21px !important;',
            '}',
            '.gallery-tweet .tweet .action-buffer-container span {',
                'background-position: -3px  -38px !important;',
                'margin-top: -1px;',
            '}',
            '.tweet:hover .action-buffer-container span.Icon {',
                'background-position: -5px -28px !important;',
            '}',
            '.tweet .action-buffer-container span.Icon:hover {',
                'background-color: #8899a6 !important;',
            '}',
            'div.stream-item-footer > ul.tweet-actions > li.action-buffer-container i {',
                'margin-top: 0px ;',
            '}',
            '#profile_popup-body > ol > li > div > div.content > ',
                'div.stream-item-footer > ul.tweet-actions > li.action-buffer-container {',
                'display: none;',
            '}',
        '</style>'
    ].join(''));

    var buildElement = function buildElement (parentConfig) {
        
        var temp = document.createElement(parentConfig[0]);
        if( parentConfig[1] ) temp.setAttribute('class', parentConfig[1]);
        if( parentConfig[2] ) temp.setAttribute('style', parentConfig[2]);

        if ( parentConfig.length > 3 ) {
            var i = 3, l = parentConfig.length;
            for(; i < l; i++) {
                temp.appendChild(buildElement(parentConfig[i]));
            }
        }
        
        return temp;
        
    };
    
    var config = {};
    config.time = {
        success: {
            delay: 2000
        }
    };
    var should_be_native_retweet = true;
    config.buttons = [
        {
            // The standalone tweet page after a "Tweet" button has been clicked
            name: "twitter-button",
            text: "Buffer",
            container: 'div.ft',
            after: 'input[type="submit"]',
            default: [
                'margin-left: 8px;',
                'background: #eee;',
                'background: -webkit-linear-gradient(bottom, #eee 25%, #f8f8f8 63%);',
                'background: -moz-linear-gradient(bottom, #eee 25%, #f8f8f8 63%);',
                'border: 1px solid #999;',
                'color: #444 !important;',
                'text-shadow: rgba(0, 0, 0, 0.246094) 0px -1px 0px;'
            ].join(''),
            className: 'button',
            selector: '.button',
            style: [
                'margin-left: 8px;',
                'background: #4C9E46;',
                'background: -webkit-linear-gradient(bottom, #4C9E46 25%, #54B14E 63%);',
                'background: -moz-linear-gradient(bottom, #4C9E46 25%, #54B14E 63%);',
                'border: 1px solid #40873B;',
                'color: white !important;',
                'text-shadow: rgba(0, 0, 0, 0.246094) 0px -1px 0px;'
            ].join(''),
            hover: [
                'background: #40873B;',
                'background: -webkit-linear-gradient(bottom, #40873B 25%, #4FA749 63%);',
                'background: -moz-linear-gradient(bottom, #40873B 25%, #4FA749 63%);'
            ].join(''),
            active: [
                'box-shadow: inset 0 5px 10px -6px rgba(0,0,0,.5);',
                'background: #40873B;',
                'background: -webkit-linear-gradient(bottom, #40873B 25%, #4FA749 63%);',
                'background: -moz-linear-gradient(bottom, #40873B 25%, #4FA749 63%);'
            ].join(''),
            create: function (btnConfig) {
                window.resizeTo(845,700);
                window.moveTo(screen.availWidth/2-845/2, screen.availHeight/2+700/2);

                var a = document.createElement('a');
                a.setAttribute('class', btnConfig.className);
                a.setAttribute('style', btnConfig.default);
                a.setAttribute('href', '#');
                $(a).text(btnConfig.text);

                $(a).hover(function () {
                    if( $(this).hasClass("disabled") ) {
                        $(this).attr('style', btnConfig.default);
                        return;
                    }
                    $(this).attr('style', btnConfig.style + btnConfig.hover);
                }, function() {
                    if( $(this).hasClass("disabled") ) return;
                    $(this).attr('style', btnConfig.style);
                });
                
                $(a).mousedown(function () {
                    if( $(this).hasClass("disabled") ) return;
                    $(this).attr('style', btnConfig.style + btnConfig.active);
                });
                
                $(a).mouseup(function () {
                    if( $(this).hasClass("disabled") ) return;
                    $(this).attr('style', btnConfig.style + btnConfig.hover);
                });

                return a;

            },
            data: function (elem) {
                return {
                    text: $(elem).parents('.ft').siblings('.bd').find('#status').val(),
                    placement: 'twitter-tweetbutton'
                };
            },
            clear: function (elem) {
                window.close();
            },
            activator: function (elem, btnConfig) {
                var target = $(elem).parents('.ft').siblings('.bd').find('#status');
                var activate = function () {
                    var val = $(target).val();
                    var counter = $(elem).siblings('#char-count').val();
                    if ( val && val.length > 0 && counter > -1) {
                        $(elem).removeClass('disabled').attr('style', btnConfig.style);
                    } else {
                        $(elem).addClass('disabled').attr('style', btnConfig.default);
                    }
                };
                $(target).on('keyup focus blur change paste cut', function (e) {
                    activate();
                });
                activate();
            }
        },    
        {
            // The main composer in the twitter "home" page
            // NOTE: Additional style overrides are located at the top of this file
            name: "composer",
            text: "Buffer",
            container: 'div.tweet-button-sub-container, div.tweet-button',
            after: '.tweet-counter',
            className: 'buffer-tweet-button btn disabled',
            selector: '.buffer-tweet-button',
            default: [
                'vertical-align: top;',
                'line-height: 19px;',
            ].join(''),
            style: [
                'vertical-align: top;',
                'line-height: 19px;',
                'background: #4C9E46;',
                'border: 1px solid rgba(0,0,0,0);',
                'color: white !important;',
                'text-shadow: rgba(0, 0, 0, 0.246094) 0px -1px 0px;',
                'font-weight: bold;',
                'box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);'
            ].join(''),
            hover: [
                'background: #40873B;',
                'background-image: -webkit-linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.15));',
                'background-image: -moz-linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.15));',
                'background-image: linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.15));'
            ].join(''),
            active: [
                'box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.3);',
                'background: #40873B; text-decoration: none;'
            ].join(''),
            create: function (btnConfig) {

                var a = document.createElement('a');
                a.setAttribute('class', btnConfig.className);
                a.setAttribute('style', btnConfig.default);
                a.setAttribute('href', '#');
                $(a).text(btnConfig.text);

                $(a).hover(function () {
                    if( $(this).hasClass("disabled") ) {
                        $(this).attr('style', btnConfig.default);
                        return;
                    }
                    $(this).attr('style', btnConfig.style + btnConfig.hover);
                }, function() {
                    if( $(this).hasClass("disabled") ) return;
                    $(this).attr('style', btnConfig.style);
                });
                
                $(a).mousedown(function () {
                    if( $(this).hasClass("disabled") ) return;
                    $(this).attr('style', btnConfig.style + btnConfig.active);
                });
                
                $(a).mouseup(function () {
                    if( $(this).hasClass("disabled") ) return;
                    $(this).attr('style', btnConfig.style + btnConfig.hover);
                });

                return a;
            },
            ignore: function(container) {
                return $(container).closest('.dm-dialog').length ? true : false;
            },
            data: function (elem) {
                var text = $(elem)
                        .parents('form')
                        .find('.tweet-content .tweet-box')
                        .text();

                return {
                    text: text,
                    placement: 'twitter-composer'
                };
            },
            clear: function (elem) {
                // Homebox
                var $content = $(elem)
                        .parents('form')
                        .find('.tweet-content');
                var $target = $content.find('.tweet-box');

                if($(elem).parents('.home-tweet-box').length > 0){
                    // If its the home box condense the box after buffer
                    $content
                        .parents('form')
                        .addClass('condensed');
                }

                $target.text('');
               
                // Modal Close
                // Closes the modal box
                $('#global-tweet-dialog .js-close').click();
            },
            activator: function (elem, btnConfig) {
                var $elem = $(elem);
                var $target = $elem
                        .parents('form')
                        .find('.tweet-content .tweet-box');

                $target.on('keyup focus blur change paste cut', function (e) {
                    var val = $(this).text();
                    var counter = $elem.siblings('.tweet-counter').text() ||
                        $elem.siblings('.tweet-counter').val();

                    if ( val.length > 0 && counter > -1 && val !== 'Compose new Tweet...') {
                        $elem
                            .removeClass('disabled')
                            .attr('style', btnConfig.style);
                    } else {
                        $elem
                            .addClass('disabled')
                            .attr('style', btnConfig.default);
                    }
                });
            }
        },
        {
            name: "retweet",
            text: "Buffer Retweet",
            container: '#retweet-tweet-dialog div.modal-footer, #retweet-dialog .twttr-prompt',
            after: 'button:last-child',
            className: 'buffer-tweet-button btn',
            selector: '.buffer-tweet-button',
            default: 'margin-left: 4px; background: #4C9E46; border: 1px solid #40873B; color: white !important; text-shadow: rgba(0, 0, 0, 0.246094) 0px -1px 0px; font-weight: bold; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);',
            style: 'margin-left: 4px; background: #4C9E46; border: 1px solid #40873B; color: white !important; text-shadow: rgba(0, 0, 0, 0.246094) 0px -1px 0px; font-weight: bold; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);',
            hover: 'background: #40873B; background-image: -webkit-linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.15)); background-image: -moz-linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.15)); background-image: linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.15));',
            active: 'box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.3); background: #40873B; text-decoration: none;',
            create: function (btnConfig) {

                var a = document.createElement('a');
                a.setAttribute('class', btnConfig.className);
                a.setAttribute('style', btnConfig.default);
                a.setAttribute('href', '#');
                $(a).text(btnConfig.text);

                $(a).hover(function () {
                    if( $(this).hasClass("disabled") ) {
                        $(this).attr('style', btnConfig.default);
                        return;
                    }
                    $(this).attr('style', btnConfig.style + btnConfig.hover);
                }, function() {
                    if( $(this).hasClass("disabled") ) return;
                    $(this).attr('style', btnConfig.style);
                });
                
                $(a).mousedown(function () {
                    if( $(this).hasClass("disabled") ) return;
                    $(this).attr('style', btnConfig.style + btnConfig.active);
                });
                
                $(a).mouseup(function () {
                    if( $(this).hasClass("disabled") ) return;
                    $(this).attr('style', btnConfig.style + btnConfig.hover);
                });

                return a;

            },
            data: function (elem) {
                var c = $(elem).closest('.retweet-tweet-dialog, #retweet-dialog, #retweet-tweet-dialog');
                var tweet = c.find('.tweet').first();
                if (should_be_native_retweet) {
                    return {
                        text: 'RT @' + c.find('.stream-item-header .username, .twttr-reply-screenname').first().text().trim().replace(/^@/, '') + ': ' + c.find('.js-tweet-text').text().trim() + '',
                        placement: 'twitter-retweet',
                        retweeted_tweet_id: tweet.data('feedback-key').replace('stream_status_', ''),
                        retweeted_user_id: tweet.data('user-id'),
                        retweeted_user_name: tweet.data('screen-name'),
                        retweeted_user_display_name: tweet.data('name')
                    };
                } else { // not a native retweet
                    return {
                        text: 'RT @' + c.find('.stream-item-header .username, .twttr-reply-screenname').first().text().trim().replace(/^@/, '') + ': ' + c.find('.js-tweet-text').text().trim() + '',
                        placement: 'twitter-retweet',
                    };
                }
            }   
        },
        {
            name: "buffer-permalink-action",
            text: "Buffer",
            container: '.permalink-tweet div.stream-item-footer .tweet-actions',
            after: '.action-fav-container',
            default: '',
            className: 'buffer-action',
            selector: '.buffer-action',
            style: '',
            hover: '',
            active: '',
            create: function (btnConfig) {

                var li = document.createElement('li');
                li.className = "action-buffer-container";

                var a = document.createElement('a');
                a.setAttribute('class', btnConfig.className + " with-icn");
                a.setAttribute('href', '#');

                var i = document.createElement('i');
                i.setAttribute('class', 'sm-reply'); // let Twitter set the bg color
                i.setAttribute('style', 'top: -2px; position: relative; margin-right: 4px; width: 16px; height: 16px; background-image: url(' + xt.data.get('data/shared/img/twttr-sprite.png') + ')!important; background-repeat: no-repeat; background-position: -5px -5px !important;');

                $(a).append(i);

                var b = document.createElement('b');
                $(b).text(btnConfig.text);

                $(a).append(b);

                $(li).append(a);

                return li;


            },
            data: function (elem) {
                var c = $(elem).closest('.tweet');
                // Grab the tweet text
                var text = c.find('.js-tweet-text').first();
                // Iterate through all links in the text
                $(text).children('a').each(function () {
                    // Don't modify the screennames and the hashtags
                    if( $(this).attr('data-screen-name') ) return;
                    if( $(this).hasClass('twitter-atreply') ) return;
                    if( $(this).hasClass('twitter-hashtag') ) return;
                    // swap the text with the actual link
                    var original = $(this).text();
                    $(this).text($(this).attr("href")).attr('data-original-text', original);
                });
                // Build the RT text
                var rt = 'RT ' + c.find('.username').first().text().trim() + ': ' + $(text).text().trim() + '';
                // Put the right links back
                $(text).children('a').each(function () {
                    if( ! $(this).attr('data-original-text') ) return;
                    $(this).text($(this).attr('data-original-text'));
                });
                // Send back the data
                if (should_be_native_retweet) {
                    return {
                        text: rt,
                        placement: 'twitter-permalink',
                        // grab info for retweeting
                        retweeted_tweet_id: c.data('feedback-key').replace('stream_status_', ''),
                        retweeted_user_id: c.data('user-id'),
                        retweeted_user_name: c.data('screen-name'),
                        retweeted_user_display_name: c.data('name')
                    }
                } else {
                    return {
                        text: rt,
                        placement: 'twitter-permalink'
                    }
                }
            },
            clear: function (elem) {
            },
            activator: function (elem, btnConfig) {

                if( $(elem).closest('.in-reply-to').length > 0 ) {
                    $(elem).find('i').css({'background-position-y': '-30px'});
                }

            }
        },
        {
            name: "buffer-action",
            text: "Buffer",
            container: '.tweet-actions',
            after: '.action-fav-container',
            default: '',
            className: 'buffer-action',
            selector: '.buffer-action',
            style: '',
            hover: '',
            active: '',
            create: function (btnConfig) {

                var li = document.createElement('li');
                li.className = "action-buffer-container";

                var a = document.createElement('a');
                a.setAttribute('class', btnConfig.className + " with-icn");
                a.setAttribute('href', '#');

                var i = document.createElement('span');
                i.setAttribute('class', 'icon sm-reply'); // let Twitter set the bg colors
                i.setAttribute('style', 'position: relative; top: 0px; margin-right: 4px; background-image: url(' + xt.data.get('data/shared/img/twttr-sprite-small.png') + ')!important; background-repeat: no-repeat;');

                $(a).append(i);

                var b = document.createElement('b');
                $(b).text(btnConfig.text);

                $(a).append(b);

                $(li).append(a);

                return li;


            },
            data: function (elem) {
                var c = $(elem).closest('.tweet');
                // Grab the tweet text
                var text = c.find('.js-tweet-text').first();
                // Iterate through all links in the text
                $(text).children('a').each(function () {
                    // Don't modify the screennames and the hashtags
                    if( $(this).attr('data-screen-name') ) return;
                    if( $(this).hasClass('twitter-atreply') ) return;
                    if( $(this).hasClass('twitter-hashtag') ) return;
                    // swap the text with the actual link
                    var original = $(this).text();
                    $(this).text($(this).attr("href")).attr('data-original-text', original);
                });
                // Build the RT text
                var rt = 'RT ' + c.find('.username').first().text().trim() + ': ' + $(text).text().trim() + '';
                // Put the right links back
                $(text).children('a').each(function () {
                    if( ! $(this).attr('data-original-text') ) return;
                    $(this).text($(this).attr('data-original-text'));
                });
                // Send back the data
                if (should_be_native_retweet) {
                    return {
                        text: rt,
                        placement: 'twitter-permalink',
                        // grab info for retweeting
                        retweeted_tweet_id: c.data('feedback-key').replace('stream_status_', ''),
                        retweeted_user_id: c.data('user-id'),
                        retweeted_user_name: c.data('screen-name'),
                        retweeted_user_display_name: c.data('name')
                    };
                } else {
                    return {
                        text: rt,
                        placement: 'twitter-feed'
                    };
                }
            },
            clear: function (elem) {
            },
            activator: function (elem, btnConfig) {

                if( $(elem).closest('.in-reply-to').length > 0 ) {
                    $(elem).find('i').css({'background-position-y': '-21px'});
                }
            }
        },
        {
            // Spring 2014 new profiles layout
            name: "buffer-profile-stream-RT-2014",
            text: "Add to Buffer",
            container: '.js-stream-item .js-actions',
            after: '.js-toggle-rt',
            default: '',
            className: 'ProfileTweet-action js-tooltip',
            selector: '.buffer-action',
            style: [
                'position: relative;',
                'top: 2px;',
                'width: 16px;',
                'height: 18px;',
                'background-image: url(' + xt.data.get('data/shared/img/twttr-sprite.png') + ') !important;',
                'background-color: #ccd6dd;',
                'background-position: -5px -3px;',
                'background-repeat: no-repeat;'
            ].join(''),
            hover: '',
            active: '',
            create: function (btnConfig) {

                var li = document.createElement('li');
                li.className = "action-buffer-container";
                // Normal is 10px, this adds space for display: inline-block hidden space
                li.style.marginLeft = '12px'; 

                var a = document.createElement('a');
                a.setAttribute('class', btnConfig.className);
                a.setAttribute('href', '#');
                a.setAttribute('data-original-title', btnConfig.text); // Tooltip text

                var i = document.createElement('span');
                i.setAttribute('class', 'Icon');
                i.setAttribute('style', btnConfig.style);
                
                i.onmouseover = function(e) {
                    this.style.backgroundColor = '#168eea';
                };
                i.onmouseout = function(e) {
                    this.style.backgroundColor = '#ccd6dd';
                };

                $(a).append(i);

                $(li).append(a);

                return li;
            },
            data: function (elem) {
                var c = $(elem).closest('.js-tweet');
                // Grab the tweet text
                var text = c.find('.js-tweet-text').first();
                // Iterate through all links in the text
                $(text).children('a').each(function () {
                    // Don't modify the screenames and the hastags
                    if( $(this).attr('data-screen-name') ) return;
                    if( $(this).hasClass('twitter-atreply') ) return;
                    if( $(this).hasClass('twitter-hashtag') ) return;
                    // swap the text with the actual link
                    var original = $(this).text();
                    $(this).text($(this).attr("href")).attr('data-original-text', original);
                });
                // Build the RT text
                var rt = 'RT ' + c.find('.username').first().text().trim() + ': ' + $(text).text().trim() + '';
                // Put the right links back
                $(text).children('a').each(function () {
                    if( ! $(this).attr('data-original-text') ) return;
                    $(this).text($(this).attr('data-original-text'));
                });
                // Send back the data
                if (should_be_native_retweet) {
                    return {
                        text: rt,
                        placement: 'twitter-permalink',
                        // grab info for retweeting
                        retweeted_tweet_id: c.data('feedback-key').replace('stream_status_', ''),
                        retweeted_user_id: c.data('user-id'),
                        retweeted_user_name: c.data('screen-name'),
                        retweeted_user_display_name: c.data('name')
                    };
                } else {
                    return {
                        text: rt,
                        placement: 'twitter-feed'
                    };
                }
            },
            clear: function (elem) {
            },
            activator: function (elem, btnConfig) {
                var $btn = $(elem);

                // Remove extra margin on the last item in the list to prevent overflow
                var moreActions = $btn.siblings('.js-more-tweet-actions').get(0);
                if (moreActions) {
                    moreActions.style.marginRight = '0px';
                }

                if( $btn.closest('.in-reply-to').length > 0 ) {
                    $btn.find('i').css({'background-position-y': '-21px'});
                }
            }
        },
        {   
            // Twitter is testing new stream action button placement - March 2014
            name: "buffer-action-2014",
            text: "Add to Buffer",
            container: '.tweet-actions-sidebar',
            after: '.action-rt-container',
            default: '',
            className: 'js-tooltip',
            selector: '.buffer-action',
            style: '',
            hover: '',
            active: '',
            create: function (btnConfig) {

                var li = document.createElement('li');
                li.className = "action-buffer-container";
                // Normal is 10px, this adds space for display: inline-block hidden space
                li.style.marginLeft = '12px'; 

                var a = document.createElement('a');
                a.setAttribute('class', btnConfig.className);
                a.setAttribute('href', '#');
                a.setAttribute('data-original-title', btnConfig.text); // Tooltip text

                var i = document.createElement('span');
                i.setAttribute('class', 'Icon');
                i.setAttribute('style', 'position: relative; top: 1px; width: 16px; height: 18px; margin-right: 5px; background-image: url(' + xt.data.get('data/shared/img/twttr-sprite.png') + ')!important; background-color: #ccd6dd; background-position: -5px -3px; background-repeat: no-repeat;');

                $(a).append(i);

                $(li).append(a);

                return li;
            },
            data: function (elem) {
                var c = $(elem).closest('.tweet');
                // Grab the tweet text
                var text = c.find('.js-tweet-text').first();
                // Iterate through all links in the text
                $(text).children('a').each(function () {
                    // Don't modify the screennames and the hashtags
                    if( $(this).attr('data-screen-name') ) return;
                    if( $(this).hasClass('twitter-atreply') ) return;
                    if( $(this).hasClass('twitter-hashtag') ) return;
                    // swap the text with the actual link
                    var original = $(this).text();
                    $(this).text($(this).attr("href")).attr('data-original-text', original);
                });
                // Build the RT text
                var rt = 'RT ' + c.find('.username').first().text().trim() + ': ' + $(text).text().trim() + '';
                // Put the right links back
                $(text).children('a').each(function () {
                    if( ! $(this).attr('data-original-text') ) return;
                    $(this).text($(this).attr('data-original-text'));
                });
                // Send back the data
                if (should_be_native_retweet) {
                    return {
                        text: rt,
                        placement: 'twitter-permalink',
                        // grab info for retweeting
                        retweeted_tweet_id: c.data('feedback-key').replace('stream_status_', ''),
                        retweeted_user_id: c.data('user-id'),
                        retweeted_user_name: c.data('screen-name'),
                        retweeted_user_display_name: c.data('name')
                    };
                } else {
                    return {
                        text: rt,
                        placement: 'twitter-feed'
                    };
                }
            },
            clear: function (elem) {
            },
            activator: function (elem, btnConfig) {

                if( $(elem).closest('.in-reply-to').length > 0 ) {
                    $(elem).find('i').css({'background-position-y': '-21px'});
                }
            }
        }

    ];

    var insertButtons = function () {

        config.buttons.forEach(function(btnConfig){
            
            $(btnConfig.container).each(function () {
                
                var $container = $(this);
                
                if( !! btnConfig.ignore ) {
                    if( btnConfig.ignore($container) ) return;
                }
                
                if ( $container.hasClass('buffer-inserted') ) return;

                $container.addClass('buffer-inserted');

                var btn = btnConfig.create(btnConfig);

                $container.find(btnConfig.after).after(btn);

                if ( !! btnConfig.activator) btnConfig.activator(btn, btnConfig);
                
                var getData = btnConfig.data;
                var clearData = btnConfig.clear;
                
                var clearcb = function () {};

                $(btn).click(function (e) {
                    clearcb = function () { // allow clear to be called for this button
                        if ( !! clearData ) clearData(btn);
                    };
                    xt.port.emit("buffer_click", getData(btn));
                    e.preventDefault();
                });
                
                xt.port.on("buffer_embed_clear", function () {
                    clearcb();
                    clearcb = function () {}; // prevent clear from being called again, until the button is clicked again
                });
                
            });

        });

    };

    /**
     * Remove extra buttons that are not needed or wanted
     */
    var removeExtras = function () {
        $('.replies .buffer-tweet-button').remove();
        $('.inline-reply-tweetbox .buffer-tweet-button').remove();
    };

    var twitterLoop = function twitterLoop() {
        insertButtons();
        removeExtras();
        setTimeout(twitterLoop, 500);
    };

    // Wait for xt.options to be set
    ;(function check() {
        // If twitter is switched on, start the main loop
        if ( !xt.options) {
            setTimeout(check, 0);
        }
        else if( xt.options['buffer.op.twitter'] === 'twitter') {
            twitterLoop();
        } else {
            setTimeout(check, 2000);
        }
    }());

    
}());