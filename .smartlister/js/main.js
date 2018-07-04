"use strict";

//  set general functions

//  test for mobile layout (based on width)
var mobile = false;
if (window.innerWidth < 715) {
    mobile = true;
}
$(window).resize(function () {
    if (window.innerWidth < 715) {
        mobile = true;
    } else {
        mobile = false;
    }
});

//  waves
var xObj = 0;
function waves(obj, opacity) {
    var xObjId = "#" + xObj;
    if (opacity == null || opacity == "") {
        var xopacity = "rgba(255,255,255, .3);";
    } else {
        var xopacity = "rgba(0,0,0, " + opacity + ");";
    }
    if ($(obj).innerWidth() > $(obj).innerHeight()) {
        var xObjVal = 1.4 * $(obj).innerWidth(),
            xObjValHalf = xObjVal / 2;
    } else {
        var xObjVal = 1.4 * $(obj).innerHeight(),
            xObjValHalf = xObjVal / 2;
    }
    $(obj).prepend('<div id="' + xObj + '" class="waves" style="background-color: ' + xopacity + ';"></div>');
    setTimeout(function () {
        $(xObjId).addClass("active").css({ "top": "calc(50% - " + xObjValHalf + "px)", "left": "calc(50% - " + xObjValHalf + "px)", "width": xObjVal + "px", "height": xObjVal + "px", "border-radius": xObjVal + "px" });
    }, 50);
    setTimeout(function () {
        $(xObjId).remove();
    }, 850);
    xObj += 1;
}

//  support for includes function in older browsers
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

function escapeHtml(text) {
    if (text == null || text.length < 1) {
        return '';
    }
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

function toUpper(str) {
    if (str.length < 1) {
        return '';
    }
    return str.toLowerCase().split(' ').map(function (word) {
        return word[0].toUpperCase() + word.substr(1);
    }).join(' ');
}

//  sort array of objects by property value
function objSort(key) {
    var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'asc';

    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }

        var varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
        var varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

        var comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return order == 'desc' ? comparison * -1 : comparison;
    };
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(function (key) {
        return object[key] === value;
    });
}

$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined && this.attr(name) !== false && this.attr(name) !== null;
};

//  function to systematically fade in objects with a set delay
function multipleChildFadeIn(obj, type, time, delay) {
    setTimeout(function () {
        var thisTime = 0;
        $(obj).children().each(function () {
            var thisObj = $(this);
            setTimeout(function () {
                thisObj.removeClass("hide");
                thisObj.addClass(type);
            }, thisTime);
            thisTime += time;
        });
    }, delay);
}
function multipleChildFadeInReset(obj, type, delay) {
    setTimeout(function () {
        $(obj).children().each(function () {
            $(this).addClass("hide");
            $(this).removeClass(type);
        });
    }, delay);
}

//  function to systematically fade in objects with a set delay
function multipleFadeIn(obj, type, time, delay) {
    setTimeout(function () {
        var thisTime = 0;
        $(obj).each(function () {
            var thisObj = $(this);
            setTimeout(function () {
                thisObj.removeClass("hide fadeInUp fadeOutDown");
                thisObj.addClass(type);
            }, thisTime);
            thisTime += time;
        });
    }, delay);
}
function multipleFadeInReset(obj, type, delay) {
    setTimeout(function () {
        $(obj).each(function () {
            $(this).addClass("hide");
            $(this).removeClass(type);
        });
    }, delay);
}

//  fade in one object with optional delays
function fadeIn(obj, type, delay) {
    setTimeout(function () {
        obj.removeClass('hidden');
        obj.addClass(type);
    }, delay);
}

//  main js

$(document).ready(function () {

    window.content = {};
    window.sort = 'asc';

    //  sort directory out
    directory = directory;
    if (directory == null || directory == undefined) {
        directory = 'root';
    }

    //  if cookies not set, set them
    if (Cookies.get('directoryLister') == null || Cookies.get('directoryLister') == undefined) {
        var obj = JSON.stringify({ 'sort': 'asc' });
        Cookies.set('directoryLister', Base64.encode(obj), { expires: 9999 });
    }

    //  get cookie
    function getCookie(cookie) {
        return JSON.parse(Base64.decode(Cookies.get(cookie)));
    }

    //  update cookie
    function updateCookie(cookieName, setting, value) {
        try {
            var cookie = getCookie(cookieName);
            cookie[setting] = value;
            Cookies.set(cookieName, Base64.encode(JSON.stringify(cookie)), { expires: 9999 });
        } catch (error) {
            console.error('[Cookie] Unable to update cookie (' + error + ')');
        }
    }

    //  set sort setting
    sort = getCookie('directoryLister')['sort'];

    if (sort == 'asc') {
        $(this).find('svg').removeClass('reversed');
    } else {
        $(this).find('svg').addClass('reversed');
    }

    //  update toast box
    var toastNumber = 0;
    function toast(text, icon, time) {
        var currentNumber = toastNumber;
        if (icon.length > 0) {
            switch (icon) {
                case 'cross':
                    icon = "<span>\n                         <svg viewBox=\"0 0 24 24\">\n                             <path d=\"M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z\" />\n                         </svg>\n                     </span>";
                    break;
                case 'tick':
                    icon = "<span>\n                          <svg viewBox=\"0 0 24 24\">\n                              <path d=\"M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z\" />\n                          </svg>\n                      </span>";
                    break;
            }
        }
        $('.toast').prepend('<div class="item" toast-id="' + currentNumber + '"><p>' + icon + text + '</p></div>');
        $('.toast .item[toast-id=' + currentNumber + ']').fadeIn(180);
        setTimeout(function () {
            $('.toast .item[toast-id=' + currentNumber + ']').slideUp(180);
        }, time);
        toastNumber += 1;
    }

    //  prompt user to stay if uploading
    $(window).on('beforeunload', function (e) {
        var unUploadedFiles = $('.files-container .directory .uploading').length;
        if (unUploadedFiles > 0) {
            return false;
        }
    });

    //  set shortcut key codes
    $(document).keyup(function (e) {

        //  enter - open item
        if (e.which == 13 || e.keyCode == 13) {
            var activeItem = $('.files-container .directory[id=' + md5(directory) + '] .item.active:not(.uploading, .new, .deleting)');
            if (activeItem.length == 1) {
                $(activeItem).trigger(action);
            }
        }

        //  f key - new folder
        //if (e.which == 70 || e.keyCode == 70) {
        //    e.preventDefault();
        //    var newFolderObj = $('.files-container .directory .folders .item.new');
        //    if (newFolderObj.length < 1 || newFolderObj.hasClass('slideUp')) {
        //        $('.info-items .item.newFolder').trigger('click');
        //    }
        //}

        //  f2 key - rename item
        if (e.which == 113 || e.keyCode == 113) {
            e.preventDefault();
            renameToggle(true);
        }

        //  arrow up - select next item
        if (e.which == 38 || e.keyCode == 38) {
            e.preventDefault();

            renameToggle(false);

            //  select items of all combinations
            var items = $('.files-container .directory[id=' + md5(directory) + '] .item:not(.uploading, .new, .deleting)'),
                firstFolder = $('.files-container .directory[id=' + md5(directory) + '] .folders .item:not(.uploading, .new, .deleting)').first(),
                lastFolder = $('.files-container .directory[id=' + md5(directory) + '] .folders .item:not(.uploading, .new, .deleting)').last(),
                firstFile = $('.files-container .directory[id=' + md5(directory) + '] .files .item:not(.uploading, .new, .deleting)').first(),
                lastFile = $('.files-container .directory[id=' + md5(directory) + '] .files .item:not(.uploading, .new, .deleting)').last(),
                activeItem = $('.files-container .directory[id=' + md5(directory) + '] .item.active:not(.uploading, .new, .deleting)');

            //  select last item
            if ($(activeItem).length == 0) {
                var last = $(items).last();
                selectItem(last);
            } else {

                //  atempt to select previous item
                var up = $(activeItem).prev();
                $(items).removeClass('active');

                //  select previous item
                if (up.length == 1) {
                    selectItem(up);
                } else {

                    //  if a file
                    if (activeItem.parent().hasClass('files')) {
                        //  select last folder
                        if (lastFolder.length == 1) {
                            selectItem(lastFolder);
                        } else {
                            //  select last file
                            selectItem(lastFile);
                        }
                    } else {
                        //  if a file
                        //  select last file
                        if (lastFile.length == 1) {
                            selectItem(lastFile);
                        } else {
                            //  select last folder
                            selectItem(firstFolder);
                        }
                    }
                }
            }
        }

        //  arrow down - select next item
        if (e.which == 40 || e.keyCode == 40) {
            e.preventDefault();

            renameToggle(false);

            //  select items of all combinations
            var items = $('.files-container .directory[id=' + md5(directory) + '] .item:not(.uploading, .new, .deleting)'),
                firstFolder = $('.files-container .directory[id=' + md5(directory) + '] .folders .item:not(.uploading, .new, .deleting)').first(),
                lastFolder = $('.files-container .directory[id=' + md5(directory) + '] .folders .item:not(.uploading, .new, .deleting)').last(),
                firstFile = $('.files-container .directory[id=' + md5(directory) + '] .files .item:not(.uploading, .new, .deleting)').first(),
                lastFile = $('.files-container .directory[id=' + md5(directory) + '] .files .item:not(.uploading, .new, .deleting)').last(),
                activeItem = $('.files-container .directory[id=' + md5(directory) + '] .item.active:not(.uploading, .new, .deleting)');

            //  select first item
            if ($(activeItem).length == 0) {
                var first = $(items).first();
                selectItem(first);
            } else {

                //  atempt to select next item
                var down = $(activeItem).next();
                $(items).removeClass('active');
                if (down.length == 1) {
                    selectItem(down);
                } else {

                    //  if a file
                    if (activeItem.parent().hasClass('files')) {
                        //  select first folder
                        if (firstFolder.length == 1) {
                            selectItem(firstFolder);
                        } else {
                            //  select first file
                            selectItem(firstFile);
                        }
                    } else {
                        //  select first file
                        if (firstFile.length == 1) {
                            selectItem(firstFile);
                        } else {
                            //  select first folder
                            selectItem(firstFolder);
                        }
                    }
                }
            }
        }
    });

    //  get folder
    function getFolder(folder) {
        if (typeof content[md5(folder)] === 'undefined' || content[md5(folder)] === null) {
            //  show loader + hide previous directory
            $('.files-container .loader').addClass('active');
            $('.files-container #' + md5(directory)).addClass('hidden');

            //  get folder items
            $.ajax({
                url: settings['listerFolderName'] + '/php/directory.php',
                type: 'POST',
                data: {
                    directory: folder
                },
                cache: false
            }).done(function (data) {
                try {
                    data = JSON.parse(data);
                    if (data['status'] == 'ok') {
                        //  add data to content
                        //  sort data by file name
                        var folderHash = md5(folder);
                        content = $.extend(content, data);
                        content[folderHash]['files'] = content[folderHash]['files'].sort(objSort('name', sort));
                        content[folderHash]['folders'] = content[folderHash]['folders'].sort(objSort('name', sort));

                        console.log('[Files] Cached items: ' + content[folderHash]['folders'].length + ' folders, ' + content[folderHash]['files'].length + ' files (' + folder + ')');
                    } else {
                        throw 'Server error';
                    }
                } catch (err) {
                    toast('Unable to get files', 'cross', 4000);
                    console.error('[Files] Unable to request items from folder: ' + folder + ' (' + err + ')');
                }
                //  add items to the page
                addDirectory(folder);
            }).fail(function () {
                toast('Unable to get files', 'cross', 4000);
                console.error('[Files] Unable to request items from folder (most likely due to loss of internet)');
            });
        } else {
            //  get folder from cache
            try {
                addDirectory(folder);
            } catch (err) {
                toast('Unable to get files', 'cross', 4000);
                console.error('[Files] Unable to retreive cached items from folder: ' + folder + ' (' + err + ')');
            }
        }
    }

    //  get starting folder
    getFolder(directory);

    //  add directory to the dom
    function addDirectory(dir) {

        var dirHash = md5(dir);

        //  create main directory element
        var directoryHTML = $('<div/>').addClass('directory').attr('id', dirHash).append('<div class="folders"></div><div class="files"></div>'),
            folderHTML = $(directoryHTML).find('.folders'),
            fileHTML = $(directoryHTML).find('.files');

        //  sort files and folders
        var items = content[dirHash];
        items['files'] = items['files'].sort(objSort('name', sort));
        items['folders'] = items['folders'].sort(objSort('name', sort));

        //  loop though adding files
        //  show message if no files
        if (items['files'].length > 0) {
            for (var item in items['files']) {
                var file = items['files'][item],
                    name = file['name'],
                    size = file['size'],
                    type = file['type'],
                    link = file['link'],
                    uploadId = file['uploadId'],
                    modified = file['modified'],
                    icon = getFileIcon(type, link, '40');
                $(fileHTML).append("\n                  <div class='item flex no-user-select' uploadId='" + uploadId + "' link='" + Base64.encode(link) + "' type='" + Base64.encode(type) + "'>\n                      " + icon + "\n                      <h2 class='name'>" + name + "</h2>\n                      <h3 class='last-modified'>" + modified + "</h3>\n                      <h3 class='size'>" + size + "</h3>\n                      <div class='progress'></div>\n                  </div>\n                ");
            }
        }
        //  loop though adding folders
        //  show message if no folders
        if (items['folders'].length > 0) {
            for (var item in items['folders']) {
                var folder = items['folders'][item],
                    name = folder['name'],
                    link = folder['link'];
                $(folderHTML).append("\n                  <div class='item flex no-user-select' name='" + name + "' link='" + Base64.encode(link) + "'>\n                      <svg viewBox=\"0 0 24 24\">\n                          <path d=\"M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z\" />\n                      </svg>\n                      <h2 class='name'>" + name + "</h2>\n                      <h3 class='last-modified'>-</h3>\n                      <h3 class='size'>-</h3>\n                  </div>\n                ");
            }
        }

        //  hide loader + previous directory
        $('.files-container .loader').removeClass('active');
        $('.files-container #' + md5(directory)).addClass('hidden');

        //  if directory does not exist - create it
        //  if it does - re-add files + folders (for sorting)
        if ($('.files-container #' + dirHash).length < 1) {
            $('.files-container').append(directoryHTML);
        } else {
            $('.files-container #' + dirHash).html(folderHTML).append(fileHTML);
        }

        //  change active directory
        directory = dir;
        getStorageQuota();
        $('.files-container #' + dirHash).removeClass('hidden');
        changeBreadcrums(dirHash);


        //  encode directory for url
        //  split directory by slashes
        var breadcrums = directory.split('/'),
            urlDirectory = '';

        //  loop breadcrums encoding each one
        for (var crum in breadcrums) {
            urlDirectory += encodeURIComponent(breadcrums[crum]) + '/';
        }
        urlDirectory = urlDirectory.substring(0, urlDirectory.length-1);

        //  change url (data | title | url)
        window.history.pushState(null, 'Smartlister', 'index.php?directory=' + urlDirectory);
    }


    //  detect file extention
    function getFileIcon(type, link, size) {
        if (!link.includes('data:image')) {
            link = settings['listerFolderName'] + ("/php/image.php?size=" + size + "&fileDirectory=" + link);
        }
        if (type.includes('photoshop')) {
            return "<svg viewBox=\"0 0 24 24\">\n                <path d=\"M5,3A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H14.09C14.03,20.67 14,20.34 14,20C14,19.32 14.12,18.64 14.35,18H5L8.5,13.5L11,16.5L14.5,12L16.73,14.97C17.7,14.34 18.84,14 20,14C20.34,14 20.67,14.03 21,14.09V5C21,3.89 20.1,3 19,3H5M19,16V19H16V21H19V24H21V21H24V19H21V16H19Z\" />\n            </svg>";
        }
        if (type.includes('image')) {
            return "<div class='img' style='background-image:url(\"" + link + "\"), url(\"" + settings['listerFolderName'] + "/img/icons/image.png\");'></div>";
        }
        if (type.includes('video')) {
            return "<svg viewBox=\"0 0 24 24\">\n                <path d=\"M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M17,19V13L14,15.2V13H7V19H14V16.8L17,19Z\" />\n            </svg>";
        }
        if (type.includes('audio')) {
            return "<svg viewBox=\"0 0 24 24\">\n                <path d=\"M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M9,16A2,2 0 0,0 7,18A2,2 0 0,0 9,20A2,2 0 0,0 11,18V13H14V11H10V16.27C9.71,16.1 9.36,16 9,16Z\" />\n            </svg>";
        }
        if (type.includes('text')) {
            return "<svg viewBox=\"0 0 24 24\">\n                <path d=\"M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z\" />\n            </svg>";
        }
        if (type.includes('pdf')) {
            return "<svg viewBox=\"0 0 24 24\">\n                 <path d=\"M14,9H19.5L14,3.5V9M7,2H15L21,8V20A2,2 0 0,1 19,22H7C5.89,22 5,21.1 5,20V4A2,2 0 0,1 7,2M11.93,12.44C12.34,13.34 12.86,14.08 13.46,14.59L13.87,14.91C13,15.07 11.8,15.35 10.53,15.84V15.84L10.42,15.88L10.92,14.84C11.37,13.97 11.7,13.18 11.93,12.44M18.41,16.25C18.59,16.07 18.68,15.84 18.69,15.59C18.72,15.39 18.67,15.2 18.57,15.04C18.28,14.57 17.53,14.35 16.29,14.35L15,14.42L14.13,13.84C13.5,13.32 12.93,12.41 12.53,11.28L12.57,11.14C12.9,9.81 13.21,8.2 12.55,7.54C12.39,7.38 12.17,7.3 11.94,7.3H11.7C11.33,7.3 11,7.69 10.91,8.07C10.54,9.4 10.76,10.13 11.13,11.34V11.35C10.88,12.23 10.56,13.25 10.05,14.28L9.09,16.08L8.2,16.57C7,17.32 6.43,18.16 6.32,18.69C6.28,18.88 6.3,19.05 6.37,19.23L6.4,19.28L6.88,19.59L7.32,19.7C8.13,19.7 9.05,18.75 10.29,16.63L10.47,16.56C11.5,16.23 12.78,16 14.5,15.81C15.53,16.32 16.74,16.55 17.5,16.55C17.94,16.55 18.24,16.44 18.41,16.25M18,15.54L18.09,15.65C18.08,15.75 18.05,15.76 18,15.78H17.96L17.77,15.8C17.31,15.8 16.6,15.61 15.87,15.29C15.96,15.19 16,15.19 16.1,15.19C17.5,15.19 17.9,15.44 18,15.54M8.83,17C8.18,18.19 7.59,18.85 7.14,19C7.19,18.62 7.64,17.96 8.35,17.31L8.83,17M11.85,10.09C11.62,9.19 11.61,8.46 11.78,8.04L11.85,7.92L12,7.97C12.17,8.21 12.19,8.53 12.09,9.07L12.06,9.23L11.9,10.05L11.85,10.09Z\" />\n            </svg>";
        }
        if (type.includes('msword') || type.includes('ms-word') || type.includes('wordprocessingml')) {
            return "<svg viewBox=\"0 0 24 24\">\n                <path d=\"M6,2H14L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M13,3.5V9H18.5L13,3.5M7,13L8.5,20H10.5L12,17L13.5,20H15.5L17,13H18V11H14V13H15L14.1,17.2L13,15V15H11V15L9.9,17.2L9,13H10V11H6V13H7Z\" />\n            </svg>";
        }
        if (type.includes('ms-excel') || type.includes('ms-access') || type.includes('spreadsheetml')) {
            return "<svg viewBox=\"0 0 24 24\">\n                <path d=\"M6,2H14L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M13,3.5V9H18.5L13,3.5M17,11H13V13H14L12,14.67L10,13H11V11H7V13H8L11,15.5L8,18H7V20H11V18H10L12,16.33L14,18H13V20H17V18H16L13,15.5L16,13H17V11Z\" />\n            </svg>";
        }
        if (type.includes('ms-powerpoint') || type.includes('presentationml')) {
            return "<svg viewBox=\"0 0 24 24\">\n                <path d=\"M6,2H14L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M13,3.5V9H18.5L13,3.5M8,11V13H9V19H8V20H12V19H11V17H13A3,3 0 0,0 16,14A3,3 0 0,0 13,11H8M13,13A1,1 0 0,1 14,14A1,1 0 0,1 13,15H11V13H13Z\" />\n            </svg>";
        }
        if (type.includes('compressed') || type.includes('zip')) {
            return "<svg viewBox=\"0 0 24 24\">\n                <path d=\"M14,17H12V15H10V13H12V15H14M14,9H12V11H14V13H12V11H10V9H12V7H10V5H12V7H14M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z\" />\n            </svg>";
        }
        if (type.includes('encrypted')) {
            return "<svg viewBox=\"0 0 24 24\">\n                <path d=\"M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z\" />\n            </svg>";
        }
        return "<svg viewBox=\"0 0 24 24\">\n            <path d=\"M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z\" />\n        </svg>";
    }

    //  reverse sort
    $(document).on('click', '.sorting .name', function (e) {
        //  reverse sorting for all future folders
        if (sort == 'asc') {
            sort = 'desc';
            updateCookie('directoryLister', 'sort', 'desc');
            $(this).find('svg').addClass('reversed');
        } else {
            sort = 'asc';
            updateCookie('directoryLister', 'sort', 'asc');
            $(this).find('svg').removeClass('reversed');
        }
        //  resort current folder
        addDirectory(directory);
    });

    //  select item
    function selectItem(obj) {
        $(obj).addClass('active');
    }

    //  reset object specific click events
    $(document).mouseup(function (e) {
        //  do not run if clicked specific objects
        if (!$(e.target).closest('.files-container .item:not(.uploading, .new), .contextmenu').length > 0) {
            $('.files-container .item').removeClass('active');
        }
    });

    //   active focus event for files
    $(document).on('mousedown touchstart contextmenu', '.files-container .item:not(.uploading, .new)', function (e) {
        if ($(this).hasClass('active')) {
            return false;
        }
        $('.files-container .item').removeClass('active');
        $(this).addClass('active');
    });

    //  calc file size
    function readableFileSize(bytes) {
        var thresh = 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    }

    //  change breadcrums to dir
    function changeBreadcrums(actualLink) {
        var breadcrumsHTML = '',
            dir = ['root'];
        if (actualLink !== md5('root')) {
            dir = content[actualLink]['breadcrums'];
        }
        for (var i = 0; i < dir.length; i++) {
            //  set required vars
            var name = escapeHtml(dir[i]),
                link = 'root',
                linkDir = ["root"];

            //  update vars
            //  get actual link + dir
            if (name !== 'root') {
                //  create path for folder
                var folderNumber = i,
                    linkDir = [],
                    link = '';
                for (var x = 0; x < folderNumber + 1; x++) {
                    linkDir.push(dir[x]);
                    link += dir[x] + '/';
                }
                link = link.slice(0, -1);
            }

            linkDir = Base64.encode(JSON.stringify(linkDir));

            breadcrumsHTML += "\n              <div class='item' link='" + link + "' dir='" + linkDir + "'>\n                  <h1>" + name + "</h1>\n              </div>\n            ";
            if (i == dir.length - 1) {
                continue;
            }
            breadcrumsHTML += "\n              <div class='separator flex'>\n                  <svg viewBox='0 0 24 24'>\n                      <path fill='#444' d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z' />\n                  </svg>\n              </div>\n            ";
        }

        //  replace breadcrums
        $('.breadcrums').html(breadcrumsHTML);
        $('.breadcrums ')[0].scrollLeft += 99999;
    }

    //  change active directory (using the breadcrums)
    $(document).on('click', '.breadcrums .item', function () {
        var newDir = $(this).attr('link');
        if (directory !== newDir) {
            getFolder(newDir);
        }
    });

    //  detect page change (e.g. back button)
    window.onpopstate = function (event) {
        var newDir = window.location.search.substring(11);
        if (directory !== newDir) {
            getFolder(newDir);
            $('.contextmenu').removeClass('active').slideUp(150);
            if ($('.fab').addClass('open')) {
                toggleFab();
            }
        }
    };

    //  open folder
    var action = mobile ? 'click' : 'dblclick';
    $(document).on(action, '.files-container .directory .folders .item:not(.new, .deleting, .renaming)', function (e) {
        var newDir = 'root' + Base64.decode($(this).attr('link'));
        if (directory !== newDir) {
            getFolder(newDir);
        }
    });

    //  download file
    $(document).on(action, '.files-container .directory .files .item:not(.uploading, .renaming), .info-items .item[link]', function (e) {
        try {
            var dlink = window.location.pathname.replace(/[\\\/][^\\\/]*$/, '') + Base64.decode($(this).attr('link'));
            window.open(dlink);
        } catch (err) {
            console.error('[Download] Unable to open file');
            toast('Unable to download file', 'cross', 4000);
        }
    });

    //  select item
    function selectItem(obj) {
        $(obj).addClass('active');
    }

    //  select next item in container
    function selectNextItem(obj) {
        var next = $(obj).next(),
            before = $(obj).prev();
        if (next.length == 1) {
            $(next).addClass('active');
        } else if (before.length == 1) {
            $(before).addClass('active');
        }
    }

    //  scroll recently uploaded files + breadcrums
    $('.info-items, .breadcrums').mousewheel(function (e, delta) {
        this.scrollLeft -= delta * 60;
        e.preventDefault();
    });
    var infoItemsScroll = 0;
    $('.info-items, .breadcrums').each(function () {
        var obj = this;
        new Hammer(this).on('pan', function (ev) {
            var scrollDiff = ev['deltaX'] - infoItemsScroll;
            obj.scrollLeft -= scrollDiff * 1.2;
            infoItemsScroll += scrollDiff;
        });
        new Hammer(this).on('panend', function (ev) {
            infoItemsScroll = 0;
        });
    });

    //  reset object specific click events
    $(document).mouseup(function (e) {
        //  do not run if clicked specific objects
        if (!$(e.target).closest('.info-items .item:not(.storage)').length > 0) {
            $('.info-items .item').removeClass('active');
        }
        if (!$(e.target).closest('.files-container .item:not(.uploading, .new), .contextmenu').length > 0) {
            $('.files-container .item').removeClass('active');
        }
        if ($(e.target).closest('.info-items .newFolder').length == 0 && $(e.target).closest('.folders .item.new').length == 0) {
            removeNewFolder();
        }
        if (!$(e.target).closest('.fab .item').length > 0) {
            if ($('.fab').addClass('open')) {
                toggleFab();
            }
        }
        if (!$(e.target).closest('.directory .item.renaming').length > 0) {
            renameToggle(false);
        }
    });

    //  double click focus event for recent files
    $(document).on('click', '.info-items .item:not(.storage, .newFolder)', function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        $('.info-items .item').removeClass('active');
        $(this).addClass('active');
    });

    //  double click focus event for files
    $(document).on('mousedown touchstart contextmenu', '.files-container .item:not(.uploading, .new)', function (e) {
        removeNewFolder();
        if ($(this).hasClass('active')) {
            return false;
        }
        $('.files-container .item').removeClass('active');
        $(this).addClass('active');
    });

    //  update storage quota
    function getStorageQuota() {
        $.ajax({
            url: settings['listerFolderName'] + '/php/storage.php',
            type: 'POST',
            data: {
                directory: directory
            },
            cache: false
        }).done(function (data) {
            try {
                data = JSON.parse(data);
                //  add data to content
                content = $.extend(content, data);

                //  add storage info to the page
                $('.info-items .item.storage h1 small').html(content['storage']);

                console.log('[Storage] Retrieved folder size: ' + content['storage']);
            } catch (err) {
                console.error('[Storage] Unable to get folder size');
            }
        });
    }getStorageQuota();

    //  file upload

    //  drag & drop
    //  toggle overlay on drag + add files on drop
    $(window).on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).on('dragover dragenter', function () {
        $('.overlay-upload').addClass('active dragdrop');
    }).on('dragleave dragend drop', function () {
        $('.overlay-upload').removeClass('active dragdrop');
    }).on('drop', function (e) {
        droppedFiles = e.originalEvent.dataTransfer.files;
        document.getElementById('upload').files = droppedFiles;
    });

    $('input#upload').change(function () {
        triggerUpload();
    });

    //  upload trigger
    var uploadedCount = 0;
    function triggerUpload() {
        //  get file vars
        var files = document.getElementById('upload').files;

        if (files.length > 0 && settings['fileUpload']) {

            //  show main loader
            $('.cloud-save-state .spinner').removeClass('hidden').addClass('fadeIn');
            $('.cloud-save-state .cloud-saved').addClass('hidden').removeClass('fadeIn');

            //  loop though uploading all files
            for (var fileNumber in files) {
                if (!files.hasOwnProperty(fileNumber)) continue;
                upload(fileNumber, uploadedCount);
                uploadedCount += 1;
            }
        }
    }

    //  upload files
    function upload(fileNumber, fileId) {

        var files = document.getElementById('upload').files;
        var file = files[fileNumber];
        var fileName = file.name.replace(/[|&;$%@"<>()+,]/g, '');

        var formData = new FormData();
        formData.append('file', file, fileName);

        //  add location to data
        formData.append('directory', directory);

        //  add file to ui
        var image = getFileIcon(file.type, '', '40');

        var type = Base64.encode(file.type),
            modified = moment().format("MMM DD, Y");


        //  encode directory for url
        //  split directory by slashes
        var fileLink = '';
        if (directory == 'root') {
            fileLink = '/';
        } else {
            var breadcrums = directory.substring(4).split('/');

            //  loop breadcrums encoding each one
            for (var crum in breadcrums) {
                fileLink += encodeURIComponent(breadcrums[crum]) + '/';
            }
        }
        var link = fileLink + encodeURIComponent(fileName);


        var fileInfo = {
            'name': fileName,
            'size': readableFileSize(file.size),
            'type': file.type,
            'link': link,
            'directory': directory,
            'uploadId': fileId,
            'modified': modified
        };

        //  remove matching filename
        for (var file in content[md5(directory)]['files']) {
            if (content[md5(directory)]['files'][file]['link'] == link) {
                console.log('duplicate');
                content[md5(directory)]['files'].splice(file, 1);
                $('.files-container .directory[id=' + md5(directory) + '] .files .item:nth-child(' + (Number(file) + 1) + ')').remove();
            }
        }

        content[md5(directory)]['files'].push(fileInfo);
        content[md5(directory)]['files'] = content[md5(directory)]['files'].sort(objSort('name', sort));
        var fileObj = "\n          <div class='item uploading flex no-user-select' uploadId='" + fileId + "' link='" + Base64.encode(link) + "' type='" + type + "'>\n              " + image + "\n              <h2 class='name'>" + fileInfo['name'] + "</h2>\n              <h3 class='last-modified'>" + fileInfo['modified'] + "</h3>\n              <h3 class='size'>" + fileInfo['size'] + "</h3>\n              <div class='progress'></div>\n          </div>\n        ";

        //  get file order
        var filePlace = '',
            fileCount = $('.files-container .directory[id=' + md5(directory) + '] .files .item').length,
            thisObj = null;
        if (fileCount > 1) {
            for (var file in content[md5(directory)]['files']) {
                if (content[md5(directory)]['files'][file]['link'] == link) {
                    filePlace = Number(file) + 1;
                }
            }
            if (filePlace > fileCount) {
                $('.files-container .directory[id=' + md5(directory) + '] .files .item:last-child').after(fileObj);
                thisObj = $('.files-container .directory[id=' + md5(directory) + '] .files .item:last-child');
            } else {
                $('.files-container .directory[id=' + md5(directory) + '] .files .item:nth-child(' + filePlace + ')').before(fileObj);
                thisObj = $('.files-container .directory[id=' + md5(directory) + '] .files .item:nth-child(' + filePlace + ')');
            }
        } else {
            $('.files-container .directory[id=' + md5(directory) + '] .files').prepend(fileObj);
            thisObj = $('.files-container .directory[id=' + md5(directory) + '] .files .item:first-child');
        }

        //  add image (if exists)
        try {
            if (window.FileReader) {
                if (Base64.decode(type).includes('image')) {
                    var reader = new FileReader();
                    reader.readAsDataURL(files[fileNumber]);
                    reader.onloadend = function (e) {
                        $('.files-container .files .item[uploadId=' + fileId + ']').find('.img').css({
                            'background-image': 'url("' + reader.result + '"), url("' + settings['listerFolderName'] + '/img/icons/image.png")'
                        });
                    };
                }
            }
        } catch (err) {}

        //  upload file
        $.ajax({
            url: settings['listerFolderName'] + '/php/upload.php',
            type: 'POST',
            data: formData,
            dataType: 'text',
            cache: false,
            processData: false,
            contentType: false,
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        $('.files-container .files .item[uploadId=' + fileId + ']').addClass('uploading').find('.progress').css({ 'width': percentComplete + '%' });
                    }
                }, false);
                return xhr;
            }
        }).done(function (data) {
            getStorageQuota();
            toast('File uploaded', 'tick', 2000);
            console.log('[Upload] File uploaded successfully');
            $('.files-container .files .item[uploadId=' + fileId + ']').removeClass('uploading').find('.progress').css({ 'opacity': '0' });
            $('.cloud-save-state .spinner').addClass('hidden').removeClass('fadeIn');
            $('.cloud-save-state .cloud-saved').removeClass('hidden').addClass('fadeIn');
        }).fail(function (data) {
            //  delete data from content
            for (var file in content[md5(fileInfo['directory'])]['files']) {
                var link = content[md5(fileInfo['directory'])]['files'][file]['link'];
                if (link == fileInfo['link']) {
                    content[md5(fileInfo['directory'])]['files'].splice(file, 1);
                    $('.files-container .files .item[uploadId=' + fileInfo['uploadId'] + ']').remove();
                }
            }
            toast('File couldn\'t be uploaded', 'cross', 4000);
            $('.files-container .files .item.uploading').remove();
            console.error('[Upload] Failed to upload items ');
        });
    }

    //  content menu item functions


    //  set contextmenu screen width
    var mobileContextmenu = false;
    if (window.innerWidth < 600) {
        mobileContextmenu = true;
    } else {
        mobileContextmenu = false;
    }
    $(window).resize(function () {
        action = mobile ? 'click' : 'dblclick';
        if (window.innerWidth < 600) {
            mobileContextmenu = true;
        } else {
            mobileContextmenu = false;
        }
    });

    //  contextmenu on files + folders
    $(document).on('contextmenu', '.files-container .item:not(.uploading, .new, .newFolder)', function (e) {
        var left = e.clientX,
            top = e.clientY;
        if (window.innerHeight < top + $('.contextmenu').height()) {
            top = top - $('.contextmenu').height();
        }
        if (window.innerWidth < left + $('.contextmenu').width()) {
            left = left - $('.contextmenu').width();
        }

        if (!mobileContextmenu) {
            $('.contextmenu').css({ 'left': left + 'px', 'top': top + 'px' });
        }
        $('.contextmenu').slideDown(150);
    });

    //  contextmenu function triggers
    $(document).on('mouseup', '.contextmenu .item', function (e) {
        if (e.which == 3) {
            return false;
        }
        var activeFile = $('.files-container .directory[id=' + directory + '] .item.active'),
            type = 'file',
            link = $(activeFile).attr('link');
        if ($(activeFile).parent().hasClass('folders')) {
            type = 'folder';
        }
        var action = $(this).attr('action');
        switch (action) {
            case 'open':
                openFile();
                break;
            case 'download':
                downloadFile();
                break;
            case 'delete':
                if (type == 'file') {
                    triggerDeleteFile();
                } else {
                    deleteFolder(link);
                }
                break;

            case 'addFile':
                $('#upload').trigger('click');
                break;
        }
        $('.contextmenu').removeClass('active').slideUp(150);
    });

    //  add new folder to files
    function addNewFolder() {

        //  check if a new foler alread exists (if so focus)
        var existingNewFolder = $('.files-container .directory[id=' + md5(directory) + '] .folders .item.new');
        if (existingNewFolder.length > 0) {
            $(existingNewFolder).remove();
        }

        //  create new folder html
        var newFolderHTML = "\n          <div class='item active new flex'>\n              <svg viewBox=\"0 0 24 24\">\n                  <path d=\"M10,4L12,6H20A2,2 0 0,1 22,8V18A2,2 0 0,1 20,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10M15,9V12H12V14H15V17H17V14H20V12H17V9H15Z\" />\n              </svg>\n              <div class='input'>\n                  <input placeholder='Folder name' type='text'>\n              </div>\n              <h3 class='last-modified'>-</h3>\n              <h3 class='size'>-</h3>\n          </div>\n        ";
        $('.files-container .directory[id=' + md5(directory) + '] .folders').prepend(newFolderHTML).find('input').focus().parent().parent().addClass('slideDown');

    }

    //  remove new folder
    function removeNewFolder() {
        try {
            $('.files-container .directory .folders .item.new').removeClass('slideDown').addClass('slideUp').find('input').focusout();
        } catch (err) {}
    }

    //  trigger adding new folder
    $(document).on('click mouseup', '.info-items .newFolder', function (e) {
        addNewFolder();
    });

    //  trigger submit new folder
    $(document).on('keyup', '.files-container .directory .folders .item.new input', function (e) {
        e.preventDefault();
        //  if enter has been pressed
        if (e.which == 13 || e.keyCode == 13) {
            //  get folder name
            //  check it is more that 1 char
            var folderName = $(this).val();
            if (folderName.length > 0) {
                newFolder(folderName);
                $(this).attr('disabled', 'true');
                $(this).parent().parent().addClass('uploading').find('svg').attr('viewBox', '0 0 66 66').html('<circle class="path" fill="none" stroke-width="4" stroke-linecap="round" cx="33" cy="33" r="30"></circle>').addClass('spinner');
            } else {
                //  remove input box if nothing entered
                removeNewFolder();
            }
        }
    });

    //  new folder
    function newFolder(name) {

        //  replace illegal characters
        name = name.replace(/[^a-z0-9._\-\!\#\[\]\=\+\;\:\~\(\)\^]/gi, '');

        //  check if folder exists
        var isDuplicate = false;
        for (var folder in content[md5(directory)]['folders']) {
            if (content[md5(directory)]['folders'][folder]['name'].toLowerCase() == name.toLowerCase()) {
              removeNewFolder();
                toast('Folder already exists', 'cross', 4000);
                throw new Error('[Folder] Duplicate found');
            }
        }

        //  make folder breadcrums
        var breadcrums = content[md5(directory)]['breadcrums'].slice();
        breadcrums.push(name);

        //  create folder
        $.ajax({
            url: settings['listerFolderName'] + '/php/newFolder.php',
            type: 'POST',
            data: {
                name: name,
                directory: directory
            },
            cache: false
        }).done(function (data) {
            try {
                data = JSON.parse(data);
                if (data['status'] == 'ok') {

                    var newFolderLink = data['newFolderLink'];

                    //  create data for content
                    var newFolderDir = {};
                    newFolderDir[md5(newFolderLink)] = {
                        'breadcrums': breadcrums,
                        'directory': newFolderLink,
                        'files': [],
                        'folders': []
                    };

                    var newFolderChild = {
                        'name': escapeHtml(name),
                        'link': newFolderLink.substring(4),
                        'modified': moment().format("MMM DD, Y")
                    };

                    //  add data to content
                    content = $.extend(content, newFolderDir);
                    content[md5(directory)]['folders'].push(newFolderChild);

                    addDirectory(directory);

                    toast('Folder created', 'tick', 2800);
                    console.log('[Folder] New folder created: ' + name);
                } else {
                    throw 'Server error';
                }
            } catch (err) {
                toast('Folder not created', 'cross', 4000);
                console.error('[Folder] Unable to create a new folder (' + err + ')');
            }
        }).fail(function () {
            toast('Folder not created', 'cross', 4000);
            console.error('[Folder] Unable to request a new folder (most likely due to loss of internet)');
        });
    }



    //  toggle item input
    var renameOldName = '';
    function renameToggle(toggle) {

        //  check settings file
        if (!settings['renameItems']) {
            return false;
        }

        //  get active item
        var item = $('.directory .item.active'),
            type = 'file';

        if ($(item).parent().hasClass('files')) {
            type = 'folder';
        }

        //  toggle rename input
        //  does not apply to new or uploading items
        if (toggle == true && item.length == 1 && !$(item).hasClass('renaming') && !$(item).hasClass('new') && !$(item).hasClass('uploading')) {

            //  save old name
            //  set input html
            renameOldName = $(item).find('.name').html();
            var input = '<div class="input"><input placeholder="Rename item" type="text"></div>';

            //  add input to item
            $(item).addClass('renaming').find('.name').after(input).remove();
            $(item).find('input').val(renameOldName).focus().select();

        } else {

            //  reset item
            $('.directory .item.renaming')
            .removeClass('renaming')
            .find('.input')
            .after('<h2 class="name">'+ renameOldName +'</h2>')
            .remove();

        }

    }


    //  trigger rename
    $(document).on('keyup', '.directory .item.renaming input', function (e) {
        e.preventDefault();
        //  if enter has been pressed
        if (e.which == 13 || e.keyCode == 13) {

            //  set type + new and old name
            var newName = $(this).val(),
                oldName = renameOldName,
                type = 'file';

            //  check if type is folder
            if ($(this).parent().parent().parent().hasClass('folders')) {
                type = 'folder';
            }

            renameItem(type, oldName, newName);

        }
    });


    //  rename file or folder
    function renameItem(type, oldName, newName) {

        //  replace illegal characters
        newName = newName.replace(/[^a-z0-9._\-\!\#\[\]\=\+\;\:\~\(\)\^\@\£\$\%\^\&\* ]/gi, '');
        var dir = directory;

        //  check if folder exists
        var isDuplicate = false;
        if (type == 'folder') {
            for (var folder in content[md5(directory)]['folders']) {
                if (content[md5(directory)]['folders'][folder]['name'].toLowerCase() == newName.toLowerCase()) {
                    toast('Folder already exists', 'cross', 4000);
                    throw new Error('[Folder] Duplicate found');
                }
            }
        } else {
            for (var file in content[md5(directory)]['files']) {
                if (content[md5(directory)]['files'][file]['name'].toLowerCase() == newName.toLowerCase()) {
                    toast('File already exists', 'cross', 4000);
                    throw new Error('[File] Duplicate found');
                }
            }
        }


        //  rename item
        $.ajax({
            url: settings['listerFolderName'] + '/php/rename.php',
            type: 'POST',
            data: {
                type: type,
                directory: dir,
                oldName: oldName,
                newName: newName
            },
            cache: false
        }).done(function (data) {
            try {
                data = JSON.parse(data);
                if (data['status'] == 'ok') {


                    //  recreate directory for new folder link
                    var linkFolder = dir.substring(4) + '/' + newName;
                    if (dir == 'root') {
                        linkFolder = '/' + newName;
                    }

                    //  encode directory for url
                    //  split directory by slashes
                    var breadcrums = dir.substring(5).split('/'),
                        linkFile = '/';

                    //  loop breadcrums encoding each one
                    for (var crum in breadcrums) {
                        linkFile += encodeURIComponent(breadcrums[crum]) + '/';
                    }
                    linkFile += encodeURIComponent(newName);


                    //  update to content
                    if (type == 'folder') {
                        for (var item in content[md5(dir)]['folders']) {
                            if (content[md5(dir)]['folders'][item]['name'] == oldName) {
                                content[md5(dir)]['folders'][item]['name'] = newName;
                                content[md5(dir)]['folders'][item]['link'] = linkFolder;
                            }
                        }
                    } else {
                        for (var item in content[md5(dir)]['files']) {
                            if (content[md5(dir)]['files'][item]['name'] == oldName) {
                                content[md5(dir)]['files'][item]['name'] = newName;
                                content[md5(dir)]['files'][item]['link'] = linkFile;
                            }
                        }
                    }

                    //  re-sort items
                    addDirectory(directory);

                    //  report a success to the user
                    if (type == 'folder') {
                        toast('Folder renamed', 'tick', 2800);
                        console.log('[Folder] Folder renamed: ' + name);
                    } else {
                        toast('File renamed', 'tick', 2800);
                        console.log('[File] File renamed: ' + name);
                    }

                } else {
                    throw 'Server error';
                }
            } catch (err) {
                toast('Item not renamed', 'cross', 4000);
                console.error('[Item] Unable to rename item (' + err + ')');
            }
        }).fail(function () {
            toast('Item not renamed', 'cross', 4000);
            console.error('[Item] Unable to request for a rename (most likely due to loss of internet)');
        });

    }





    //  open file
    function openFile() {
        var file = $('.files-container .directory[id=' + directory + '] .item.active');
        if (file.length > 0) {
            $(file).trigger(action);
        }
    }
    function downloadFile() {
        var file = $('.files-container .directory[id=' + directory + '] .item.active');
        if (file.length > 0) {
            if ($(file).parent().hasClass('files')) {
                try {
                    var dlink = '/upload/download/' + $(file).attr('link') + '/attachment';
                    $('#file-download').attr('src', dlink);
                } catch (err) {
                    console.error('[Download] Unable to download file');
                }
            } else {
                try {
                    var dlink = '/upload/downloadFolder/' + $(file).attr('link');
                    $('#file-download').attr('src', dlink);
                    //  toast('Zipped and download folder', 'tick', 2800);
                } catch (err) {
                    toast('Unable to download folder', 'cross', 4000);
                    console.error('[Download] Unable to download zipped folder');
                }
            }
        }
    }


    //  disable fab from settings
    if (!settings['fileUpload'] && !settings['folderCreation']) {
        $('.fab').css({ 'display': 'none' });
    }


    //  mobile fab
    $(document).on('click', '.fab .item', function (e) {
        waves($(this), .1);
        var action = $(this).attr('action');
        switch (action) {
            case 'toggleMenu':
                toggleFab();
                break;
            case 'newFolder':
                addNewFolder();
                break;
            case 'newFile':
                $('input#upload').trigger('click');
                break;
        }
        if ($(e.target).closest('.fab .item:not(.main)').parent().hasClass('open')) {
            toggleFab();
        }
    });


    //  toggle fab
    function toggleFab() {
        if ($('.fab').hasClass('open')) {
            $('.fab').removeClass('open');
            multipleFadeIn($('.fab .item:not(.main)'), 'fadeOutDown', 88, 0);
            setTimeout(function () {
                $('.fab .item:not(.main)').addClass('out-of-way');
            }, 200);
        } else {
            $('.fab').addClass('open');
            $('.fab .item:not(.main)').removeClass('out-of-way');
            multipleFadeIn($('.fab .item:not(.main)'), 'fadeInUp', 88, 8);
        }
    }



});
