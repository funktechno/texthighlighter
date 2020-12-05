var Highlighter  = (function() {
    function highlightSelectedText() {
        highlighter.highlightSelection("highlight");
    }

    return {
        name: "highlights",
        render: function(text, rawText) {
            this.rawText = rawText;
            return  `
            <a 
            title="Highlight it" 
            href="#">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#ffff00" d="M18.5,1.15C17.97,1.15 17.46,1.34 17.07,1.73L11.26,7.55L16.91,13.2L22.73,7.39C23.5,6.61 23.5,5.35 22.73,4.56L19.89,1.73C19.5,1.34 19,1.15 18.5,1.15M10.3,8.5L4.34,14.46C3.56,15.24 3.56,16.5 4.36,17.31C3.14,18.54 1.9,19.77 0.67,21H6.33L7.19,20.14C7.97,20.9 9.22,20.89 10,20.12L15.95,14.16" />
          </svg>
            </a>`;
        },
        action: function(event) {
            event.preventDefault();
            event.stopPropagation();
            highlightSelectedText(); 
            saveHighlights();           
        }
    };
})();

var Eraser = (function() {
    function removeHighlightFromSelectedText() {
        highlighter.unhighlightSelection();
    }

    return {
        name: "eraser",
        render: function(text, rawText) {
            this.rawText = rawText;
            return   `
            <a 
            title="Eraser" 
            href="#">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve">
            <path style="fill:#80D0E1;" d="M322.521,361.427L142.832,181.739c-8.606-8.605-8.609-22.571,0-31.18L268.317,25.074  c23.131-23.131,60.765-23.13,83.893,0l126.975,126.975c23.13,23.13,23.13,60.765,0,83.893L353.702,361.427  C345.099,370.032,331.129,370.038,322.521,361.427z"/>
            <path style="fill:#51B3DA;" d="M479.185,152.051L352.21,25.076c-23.128-23.13-60.762-23.131-83.893,0l-12.316,12.316v257.515  l66.521,66.521c8.602,8.605,22.571,8.609,31.18,0l125.483-125.485C502.315,212.815,502.315,175.181,479.185,152.051z"/>
            <path style="fill:#FF7876;" d="M372.575,460.176H254.959l97.098-97.087L141.189,152.221L17.352,276.044  c-23.136,23.136-23.136,60.765,0,83.9L144.32,486.912c11.412,11.412,26.346,17.177,41.339,17.33  c0.204,0.006,0.404,0.031,0.611,0.031h186.305c12.176,0,22.048-9.872,22.048-22.048C394.623,470.046,384.75,460.176,372.575,460.176  z"/>
            <g>
                <path style="fill:#ffff00;" d="M372.574,460.176H255.999v44.096h116.574c12.176,0,22.048-9.872,22.048-22.048   C394.622,470.046,384.751,460.176,372.574,460.176z"/>
                <polygon style="fill:#FF5E5B;" points="255.999,267.032 255.999,459.134 352.057,363.088  "/>
                <path style="fill:#ffff00;" d="M489.952,504.272h-37.275c-12.176,0-22.048-9.872-22.048-22.048   c0-12.176,9.872-22.048,22.048-22.048h37.273c12.176,0,22.048,9.872,22.048,22.048C512,494.401,502.128,504.272,489.952,504.272z"/>
                <path style="fill:#ffff00;" d="M430.244,429.513h-37.273c-12.176,0-22.048-9.872-22.048-22.048   c0-12.176,9.872-22.048,22.048-22.048h37.273c12.176,0,22.048,9.872,22.048,22.048   C452.292,419.641,442.421,429.513,430.244,429.513z"/>
            </svg>
            </a>`;
        },
        action: function(event) {
            event.preventDefault();
            event.stopPropagation();
            removeHighlightFromSelectedText(); 
            saveHighlights();           
        }
    };
})();
