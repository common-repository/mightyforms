!(function() {
  if (typeof mf == 'undefined') {
    // listen message from iFrame
    window.addEventListener
      ? window.addEventListener('message', listenMess)
      : window.attachEvent('onmessage', listenMess);

    // main function for find containers and load forms
    function mf() {
      // get all form containers
      let C = document.querySelectorAll('[class*=mighty-form]');
      C.forEach(container => {
        const prjID = container.id.replace('mf-', '');
        // create iFrame for current container
        let F = document.createElement('iframe');
        let q = `https://form.mightyforms.com/form/${prjID}/live`;
        (F.src = q),
          (F.width = '100%'),
          (F.height = '0px'),
          (F.style.transition = 'height 0.3s'),
          (F.style.webkitTransition = 'height 0.3s'),
          (F.style.height = '0px'),
          (F.style.display = 'block'),
          (F.frameBorder = '0'),
          (F.style.visibility = 'visible'),
          F.setAttribute('webkitallowfullscreen', ''),
          F.setAttribute('mozallowfullscreen', ''),
          F.setAttribute('allowfullscreen', '');

        // add listener for iFrame 'load' and put this iFrame into container
        loadPM(F, prjID, q), container.appendChild(F);
      });
    }

    ON(window, 'load', mf);
  }

  // listen event and run function
  function ON(el, event, func) {
    el.addEventListener
      ? el.addEventListener(event, func, !1)
      : el.attachEvent && el.attachEvent('on' + event, func);
  }

  function loadPM(t, n, o) {
    function send() {
      // data set for form in iFrame
      var data = {
        message: 'loaded',
        data: {
          projectId: n,
          parentWindowWidth:
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.getElementsByTagName('body')[0].clientWidth,
          parentWindowHeight:
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.getElementsByTagName('body')[0].clientHeight
        }
      };
      // send message to iFrame
      t.contentWindow.postMessage(JSON.stringify(data), o);
    }
    // if iFrame is loaded then send info to iFrame
    t.addEventListener
      ? t.addEventListener('load', send)
      : t.attachEvent('onload', send);
  }

  // listening message from iFrame
  function listenMess(e) {
    try {
      let t = JSON.parse(e.data);
      let formId = t.data.id;
      if ('updateSize' == t.message) {
        let F = document.querySelector(`#mf-${formId} iframe`);
        F.height = `${t.data.height}px`;
        F.style.height = `${t.data.height}px`;
      }
    } catch (err) {
      console.error(err);
    }
  }
})();
