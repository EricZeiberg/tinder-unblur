//#region Constants
const BLUR_REGEX = /\sBlur\(\d{1,2}px\)::a/;
const CLOSE_BUTTON_STYLE = "width: 100%";
const CLOSE_BUTTON_TEXT = "close";
const LATEST_LIKE_THUMBNAIL_CONTAINER_CLASS_NAME = "Expand Pos(r) Bdrs(4px) Ov(h)";
const MODAL_MANAGER = "modal-manager";
const THUMBNAIL_CONTAINER_CLASS_NAME = "Expand enterAnimationContainer"
const THUMBNAIL_IMAGE_URL_REGEX = /https:\/{2}preview.gotinder.com\/\w{8}-(\w{4}-){3}\w{12}\/\d{2,3}x\d{2,3}_\w{8}-(\w{4}-){3}\w{12}.jpg/
const TINDER_APP_URL = "//www.tinder.com/app";
const TINDER_GOLD_ADVERTISMENT_BUTTON_CLASS_NAME = "Fld(c) B(24px) W(100%) CenterAlign Pos(a) M(a)";
const TINDER_GOLD_ADVERTISMENT_DIALOG_BUTTON_AREA_CLASS_NAME = "Pt(16px) Pb(10px) Px(36px)";
const TINDER_GOLD_ADVERTISMENT_DIALOG_CONTENT_ARE_CLASS_NAME = "D(f) Flxg($flx1) Jc(c) Fld(c) Maw(100%) Pos(r)";
const TINDER_GOLD_ADVERTISMENT_DIALOG_CLASS_NAME = "Bdrs(8px) Ov(h) Ta(c) Bgc(#fff) M(10px) Py(36px) Px(44px) Py(12px)--s Px(20px)--s W(100%) Miw(300px) W(400px)--ml P(0)! Mah(100%)--xs Ovy(s)--xs Ovs(touch)--xs Ovsby(n)--xs";
const TINDER_GOLD_ADVERTISMENT_DIALOG_CLOSE_BUTTON_CLASS_NAME = "Pos(r) Z(1)";
const TINDER_GOLD_ADVERTISMENT_DIALOG_OPTIONS_CHILD_CLASS_NAME = "subscriptionOptionSelect__optionsContainer D(f) W(100%) Bgc($c-divider-lite) Fld(r) Jc(c)";
const TINDER_GOLD_ADVERTISMENT_DIALOG_TITLE_CLASS_NAME = "Heading W(100%) Ta(c) Mt(24px)";
const TINDER_UNBLUR_LOG_TAG = "Tinder Unblur:";
//#endregion

//#region Events
window.addEventListener("load", function () {
    if (window.location.href.startsWith(TINDER_APP_URL) === -1) {
        return
    }

    observer.observe(document, {
        childList: true,
        subtree: true
      });
});
//#endregion

//#region Fields
var clickedThumbnail = null;

var observer = new MutationObserver(function (mutations, me) {
    if(mutations) {
        mutations.forEach(mutation => {
            handleMutation(mutation);
        });
    }
  });

var thumbnailArray = [];
//#endregion

//#region Methods
function handleDialog(node) {
    if (clickedThumbnail) {
        node.getElementsByClassName(TINDER_GOLD_ADVERTISMENT_DIALOG_OPTIONS_CHILD_CLASS_NAME)[0].parentElement.remove();
        node.getElementsByClassName(TINDER_GOLD_ADVERTISMENT_DIALOG_TITLE_CLASS_NAME)[0].remove();
    
        var dialogButtonArea = node.getElementsByClassName(TINDER_GOLD_ADVERTISMENT_DIALOG_BUTTON_AREA_CLASS_NAME)[0]
        dialogButtonArea.childNodes[0].remove();
        dialogButtonArea.getElementsByClassName(TINDER_GOLD_ADVERTISMENT_DIALOG_CLOSE_BUTTON_CLASS_NAME)[0].innerText = CLOSE_BUTTON_TEXT;
    
        var dialogContentArea = node.getElementsByClassName(TINDER_GOLD_ADVERTISMENT_DIALOG_CONTENT_ARE_CLASS_NAME)[0];
        while(dialogContentArea.lastChild) {
            dialogContentArea.removeChild(dialogContentArea.lastChild);
        }
        var img = document.createElement("img");
        img.src = clickedThumbnail;
        img.style.cssText = CLOSE_BUTTON_STYLE;
        dialogContentArea.appendChild(img);
    }
    else {
        node.remove();
    }
}

function handleMutation(mutation) {
    var node = mutation.target;
    var nodeClassName = node.className;

    if (nodeClassName === LATEST_LIKE_THUMBNAIL_CONTAINER_CLASS_NAME) {
        if (node.hasChildNodes) {
            thumbnail = node.childNodes[0];
            thumbnail.className = thumbnail.className.replace(BLUR_REGEX);
            console.log(TINDER_UNBLUR_LOG_TAG, "unblured the latest like-thumbnail:", thumbnail.style.cssText.match(THUMBNAIL_IMAGE_URL_REGEX)[0]);
        }
    }
    else if (nodeClassName === THUMBNAIL_CONTAINER_CLASS_NAME) {
        if (!thumbnailArray.includes(node)) {
            thumbnailArray.push(node);
            var thumbnailImage = null

            if (node.hasChildNodes) {
                childs = node.childNodes;
                node.removeChild(childs[1]);
                thumbnailImage = childs[0].style.cssText.match(THUMBNAIL_IMAGE_URL_REGEX)[0];
                childs[0].className = childs[0].className.replace(BLUR_REGEX,"");
                console.log(TINDER_UNBLUR_LOG_TAG, "unblured a thumbnail:",thumbnailImage);
            }

            var nodeParent = node.parentElement;
            var parentParent = nodeParent.parentElement;
            nodeParent.onclick = function() {
                clickedThumbnail = thumbnailImage;
            };
            parentParent.childNodes[0].innerText = "These are the last 10 people who already liked you.";
            var tinderGoldAdvertismentButton = parentParent.parentElement.parentElement.getElementsByClassName(TINDER_GOLD_ADVERTISMENT_BUTTON_CLASS_NAME);
            if (tinderGoldAdvertismentButton.length > 0) {
                tinderGoldAdvertismentButton[0].remove();
            }
        }
    }
    else if (node.id  === MODAL_MANAGER) {
        if (node.getElementsByClassName(TINDER_GOLD_ADVERTISMENT_DIALOG_CLASS_NAME).length > 0) {
            handleDialog(node)
        }
    }
}
//#endregion
