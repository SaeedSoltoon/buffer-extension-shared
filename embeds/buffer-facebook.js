;(function() {

    // EXT
    // (obj notation)
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

    // Listen for share button clicks
    var share = {};
    $('body').on('click', 'a.share_action_link', function (e) {
        var $parent = $(this).closest('.genericStreamStory, .fbTimelineUnit, .fbxPhotoContentContainer');

		// reset share object on every 'share' button click
		share = {};

		// find the name of the person that shared the attachment
		share.via = $('.passiveName', $parent).first().text() || $('.actorName', $parent).first().text();

		// find the message for this attachment, or if none use the attachment caption
		// .tlTxFe is used on new timeline
		share.text = $('.messageBody, .tlTxFe', $parent).first().text() || $('.caption', $parent).text();

		var thumb = $('.uiPhotoThumb img, .photoUnit img, .fbPhotoImage', $parent).attr('src');
		var url = $('.uiAttachmentTitle a, a.externalShareUnit', $parent).attr('href');

		// find picture status
		if( thumb ) {
			// convert the thumbnail link to a link to the fullsize image
			share.picture = thumb.replace(/s[0-9]+x[0-9]+\//, '');

			// we pass the source of the image for the 'found at' text
			share.url = $('a.uiPhotoThumb, a.photo', $parent).attr('href');

			share.placement = 'facebook-share-picture';
		}

		// find link status
		else if (url) {
			if( url[0] == "/" ) url = "https://facebook.com" + url;
			share.url = url;
			share.placement = 'facebook-share-link';
		}
		
		// standard text status
		else
		{
			share.placement = 'facebook-share-status';
		}
    });
    
    var config = {};
    config.base = "https://facebook.com";
    config.time = {
        reload: 800
    };
    config.buttons = [
        {
            name: "status",
            text: "Buffer",
            container: 'ul.uiComposerBarRightArea',
            after: '.privacyWidget',
            className: 'buffer-facebook-button',
            selector: '.buffer-facebook-button',
            elements:
                    ['li', 'pls uiListItem uiListHorizontalItemBorder uiListHorizontalItem', '',
                        ['label', '', '',
                            ['a', 'buffer-facebook-button']
                        ]
                    ],
            default: 'background: hsl(116, 39%, 45%); background: -webkit-linear-gradient(bottom, hsl(116, 39%, 45%) 95%, hsl(116, 39%, 60%) 96%); background: -moz-linear-gradient(bottom, hsl(116, 39%, 45%) 95%, hsl(116, 39%, 60%) 96%); border: 1px solid #40873B; color: white !important;padding: 3px 10px;margin-top: 0px;display: block;',
            style:   'background: hsl(116, 39%, 45%); background: -webkit-linear-gradient(bottom, hsl(116, 39%, 45%) 95%, hsl(116, 39%, 60%) 96%); background: -moz-linear-gradient(bottom, hsl(116, 39%, 45%) 95%, hsl(116, 39%, 60%) 96%); border: 1px solid #40873B; color: white !important;padding: 3px 10px;margin-top: 0px;display: block;',
            hover:   'background: hsl(116, 39%, 42%); background: -webkit-linear-gradient(bottom, hsl(116, 39%, 42%) 95%, hsl(116, 39%, 55%) 96%); background: -moz-linear-gradient(bottom, hsl(116, 39%, 42%) 95%, hsl(116, 39%, 55%) 96%); text-decoration: none;',
            active:  'background: hsl(116, 39%, 40%); text-decoration: none;',
            create: function (btnConfig) {
                
                var temp = buildElement(btnConfig.elements);
                
                var a = $(temp).find(btnConfig.selector)[0];
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

                return temp;
                
            },
            data: function (elem) {
                return {
                    text: $(elem).closest('.uiMetaComposerMessageBox').find('textarea.textInput').val(),
                    placement: 'facebook-composer'
                }
            },
            clear: function (elem) {
                $(elem).closest('.uiMetaComposerMessageBox').find('textarea.textInput').val('');
            }
        },
        {
            name: "share",
            text: "Buffer",
            container: 'form[action="/ajax/sharer/submit/"] div.uiOverlayFooter',
            before: '.uiButtonConfirm',
            className: 'buffer-facebook-button',
            selector: '.buffer-facebook-button',
            elements: ['a', 'buffer-facebook-button uiOverlayButton uiButton uiButtonLarge'],
            default: 'background: hsl(116, 39%, 45%); background: -webkit-linear-gradient(bottom, hsl(116, 39%, 45%) 95%, hsl(116, 39%, 60%) 96%); background: -moz-linear-gradient(bottom, hsl(116, 39%, 45%) 95%, hsl(116, 39%, 60%) 96%); border: 1px solid #40873B; color: white !important;padding: 3px 6px 4px;',
            style:   'background: hsl(116, 39%, 45%); background: -webkit-linear-gradient(bottom, hsl(116, 39%, 45%) 95%, hsl(116, 39%, 60%) 96%); background: -moz-linear-gradient(bottom, hsl(116, 39%, 45%) 95%, hsl(116, 39%, 60%) 96%); border: 1px solid #40873B; color: white !important;padding: 3px 6px 4px;',
            hover:   'background: hsl(116, 39%, 42%); background: -webkit-linear-gradient(bottom, hsl(116, 39%, 42%) 95%, hsl(116, 39%, 55%) 96%); background: -moz-linear-gradient(bottom, hsl(116, 39%, 42%) 95%, hsl(116, 39%, 55%) 96%); text-decoration: none;',
            active:  'background: hsl(116, 39%, 40%); text-decoration: none;',
            create: function (btnConfig) {
                
                var temp = buildElement(btnConfig.elements);    
                
                var a = $(temp).find(btnConfig.selector)[0];
                if( ! a ) a = temp; // EXT
                a.setAttribute('style', btnConfig.default);
                a.setAttribute('href', '#');
                $(a).text(btnConfig.text); // EXT

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

                return temp;
                
            },
            data: function (elem) {
	
                var $parent = $(elem).closest('.modalWrapper');

				// if the user has written a message, allow this to override the default text
                var text = $('textarea[name="message_text"]', $parent).val();
                if( text === "Write something" ) text = undefined;
                if( text ) share.text = text;

				// fallback placement when we don't know if the attachment is a picture, link or status
				if( !share.placement ) share.placement = 'facebook-share';

				return share;
            },
            clear: function (elem) {
                share = {};
            }
        }
    ];

    ;(function bufferEmbed() {

        var insertButtons = function () {

            var i, l=config.buttons.length;
            for ( i=0 ; i < l; i++ ) {

                var btnConfig = config.buttons[i];
                
                $(btnConfig.container).each(function () {
                    
                    var container = $(this);
                    
                    if ( $(container).hasClass('buffer-inserted') ) return;

                    $(container).addClass('buffer-inserted');

                    var btn = btnConfig.create(btnConfig);

                    // EXT
                    if ( btnConfig.after ) $(container).find(btnConfig.after).after(btn);
                    else if ( btnConfig.before ) $(container).find(btnConfig.before).before(btn);
                    else $(container).append(btn);

                    if ( !! btnConfig.activator ) btnConfig.activator(btn, btnConfig);
                    
                    if ( !! btnConfig.lastly ) btnConfig.lastly(btn, btnConfig);
                    
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

            }

        };

        insertButtons();
        
        setTimeout(bufferEmbed, config.time.reload);

    }());
    
}());