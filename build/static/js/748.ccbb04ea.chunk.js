"use strict";(self.webpackChunkproduct_management=self.webpackChunkproduct_management||[]).push([[748],{59748:(e,t,n)=>{n.d(t,{A:()=>De});var o=n(60436),r=n(98139),a=n.n(r),c=n(7419),l=n(65043),i=n(83290),s=n(16436);function d(e){const[t,n]=l.useState(e);return l.useEffect((()=>{const t=setTimeout((()=>{n(e)}),e.length?0:10);return()=>{clearTimeout(t)}}),[e]),t}var u=n(36647),f=n(94414),p=n(85814),m=n(37770),g=n(78365),h=n(7060);const b=e=>{const{componentCls:t}=e,n="".concat(t,"-show-help"),o="".concat(t,"-show-help-item");return{[n]:{transition:"opacity ".concat(e.motionDurationSlow," ").concat(e.motionEaseInOut),"&-appear, &-enter":{opacity:0,"&-active":{opacity:1}},"&-leave":{opacity:1,"&-active":{opacity:0}},[o]:{overflow:"hidden",transition:"height ".concat(e.motionDurationSlow," ").concat(e.motionEaseInOut,",\n                     opacity ").concat(e.motionDurationSlow," ").concat(e.motionEaseInOut,",\n                     transform ").concat(e.motionDurationSlow," ").concat(e.motionEaseInOut," !important"),["&".concat(o,"-appear, &").concat(o,"-enter")]:{transform:"translateY(-5px)",opacity:0,"&-active":{transform:"translateY(0)",opacity:1}},["&".concat(o,"-leave-active")]:{transform:"translateY(-5px)"}}}}},y=e=>({legend:{display:"block",width:"100%",marginBottom:e.marginLG,padding:0,color:e.colorTextDescription,fontSize:e.fontSizeLG,lineHeight:"inherit",border:0,borderBottom:"".concat((0,u.zA)(e.lineWidth)," ").concat(e.lineType," ").concat(e.colorBorder)},'input[type="search"]':{boxSizing:"border-box"},'input[type="radio"], input[type="checkbox"]':{lineHeight:"normal"},'input[type="file"]':{display:"block"},'input[type="range"]':{display:"block",width:"100%"},"select[multiple], select[size]":{height:"auto"},"input[type='file']:focus,\n  input[type='radio']:focus,\n  input[type='checkbox']:focus":{outline:0,boxShadow:"0 0 0 ".concat((0,u.zA)(e.controlOutlineWidth)," ").concat(e.controlOutline)},output:{display:"block",paddingTop:15,color:e.colorText,fontSize:e.fontSize,lineHeight:e.lineHeight}}),v=(e,t)=>{const{formItemCls:n}=e;return{[n]:{["".concat(n,"-label > label")]:{height:t},["".concat(n,"-control-input")]:{minHeight:t}}}},x=e=>{const{componentCls:t}=e;return{[e.componentCls]:Object.assign(Object.assign(Object.assign({},(0,f.dF)(e)),y(e)),{["".concat(t,"-text")]:{display:"inline-block",paddingInlineEnd:e.paddingSM},"&-small":Object.assign({},v(e,e.controlHeightSM)),"&-large":Object.assign({},v(e,e.controlHeightLG))})}},w=e=>{const{formItemCls:t,iconCls:n,componentCls:o,rootPrefixCls:r,labelRequiredMarkColor:a,labelColor:c,labelFontSize:l,labelHeight:i,labelColonMarginInlineStart:s,labelColonMarginInlineEnd:d,itemMarginBottom:u}=e;return{[t]:Object.assign(Object.assign({},(0,f.dF)(e)),{marginBottom:u,verticalAlign:"top","&-with-help":{transition:"none"},["&-hidden,\n        &-hidden.".concat(r,"-row")]:{display:"none"},"&-has-warning":{["".concat(t,"-split")]:{color:e.colorError}},"&-has-error":{["".concat(t,"-split")]:{color:e.colorWarning}},["".concat(t,"-label")]:{flexGrow:0,overflow:"hidden",whiteSpace:"nowrap",textAlign:"end",verticalAlign:"middle","&-left":{textAlign:"start"},"&-wrap":{overflow:"unset",lineHeight:e.lineHeight,whiteSpace:"unset"},"> label":{position:"relative",display:"inline-flex",alignItems:"center",maxWidth:"100%",height:i,color:c,fontSize:l,["> ".concat(n)]:{fontSize:e.fontSize,verticalAlign:"top"},["&".concat(t,"-required:not(").concat(t,"-required-mark-optional)::before")]:{display:"inline-block",marginInlineEnd:e.marginXXS,color:a,fontSize:e.fontSize,fontFamily:"SimSun, sans-serif",lineHeight:1,content:'"*"',["".concat(o,"-hide-required-mark &")]:{display:"none"}},["".concat(t,"-optional")]:{display:"inline-block",marginInlineStart:e.marginXXS,color:e.colorTextDescription,["".concat(o,"-hide-required-mark &")]:{display:"none"}},["".concat(t,"-tooltip")]:{color:e.colorTextDescription,cursor:"help",writingMode:"horizontal-tb",marginInlineStart:e.marginXXS},"&::after":{content:'":"',position:"relative",marginBlock:0,marginInlineStart:s,marginInlineEnd:d},["&".concat(t,"-no-colon::after")]:{content:'"\\a0"'}}},["".concat(t,"-control")]:{"--ant-display":"flex",flexDirection:"column",flexGrow:1,["&:first-child:not([class^=\"'".concat(r,"-col-'\"]):not([class*=\"' ").concat(r,"-col-'\"])")]:{width:"100%"},"&-input":{position:"relative",display:"flex",alignItems:"center",minHeight:e.controlHeight,"&-content":{flex:"auto",maxWidth:"100%"}}},[t]:{"&-explain, &-extra":{clear:"both",color:e.colorTextDescription,fontSize:e.fontSize,lineHeight:e.lineHeight},"&-explain-connected":{width:"100%"},"&-extra":{minHeight:e.controlHeightSM,transition:"color ".concat(e.motionDurationMid," ").concat(e.motionEaseOut)},"&-explain":{"&-error":{color:e.colorError},"&-warning":{color:e.colorWarning}}},["&-with-help ".concat(t,"-explain")]:{height:"auto",opacity:1},["".concat(t,"-feedback-icon")]:{fontSize:e.fontSize,textAlign:"center",visibility:"visible",animationName:p.nF,animationDuration:e.motionDurationMid,animationTimingFunction:e.motionEaseOutBack,pointerEvents:"none","&-success":{color:e.colorSuccess},"&-error":{color:e.colorError},"&-warning":{color:e.colorWarning},"&-validating":{color:e.colorPrimary}}})}},C=e=>{const{componentCls:t,formItemCls:n}=e;return{["".concat(t,"-horizontal")]:{["".concat(n,"-label")]:{flexGrow:0},["".concat(n,"-control")]:{flex:"1 1 0",minWidth:0},["".concat(n,"-label[class$='-24'], ").concat(n,"-label[class*='-24 ']")]:{["& + ".concat(n,"-control")]:{minWidth:"unset"}}}}},O=e=>{const{componentCls:t,formItemCls:n}=e;return{["".concat(t,"-inline")]:{display:"flex",flexWrap:"wrap",[n]:{flex:"none",marginInlineEnd:e.margin,marginBottom:0,"&-row":{flexWrap:"nowrap"},["> ".concat(n,"-label,\n        > ").concat(n,"-control")]:{display:"inline-block",verticalAlign:"top"},["> ".concat(n,"-label")]:{flex:"none"},["".concat(t,"-text")]:{display:"inline-block"},["".concat(n,"-has-feedback")]:{display:"inline-block"}}}}},E=e=>({padding:e.verticalLabelPadding,margin:e.verticalLabelMargin,whiteSpace:"initial",textAlign:"start","> label":{margin:0,"&::after":{visibility:"hidden"}}}),j=e=>{const{componentCls:t,formItemCls:n,rootPrefixCls:o}=e;return{["".concat(n," ").concat(n,"-label")]:E(e),["".concat(t,":not(").concat(t,"-inline)")]:{[n]:{flexWrap:"wrap",["".concat(n,"-label, ").concat(n,"-control")]:{['&:not([class*=" '.concat(o,'-col-xs"])')]:{flex:"0 0 100%",maxWidth:"100%"}}}}}},S=e=>{const{componentCls:t,formItemCls:n,rootPrefixCls:o}=e;return{["".concat(t,"-vertical")]:{[n]:{"&-row":{flexDirection:"column"},"&-label > label":{height:"auto"},["".concat(t,"-item-control")]:{width:"100%"}}},["".concat(t,"-vertical ").concat(n,"-label,\n      .").concat(o,"-col-24").concat(n,"-label,\n      .").concat(o,"-col-xl-24").concat(n,"-label")]:E(e),["@media (max-width: ".concat((0,u.zA)(e.screenXSMax),")")]:[j(e),{[t]:{[".".concat(o,"-col-xs-24").concat(n,"-label")]:E(e)}}],["@media (max-width: ".concat((0,u.zA)(e.screenSMMax),")")]:{[t]:{[".".concat(o,"-col-sm-24").concat(n,"-label")]:E(e)}},["@media (max-width: ".concat((0,u.zA)(e.screenMDMax),")")]:{[t]:{[".".concat(o,"-col-md-24").concat(n,"-label")]:E(e)}},["@media (max-width: ".concat((0,u.zA)(e.screenLGMax),")")]:{[t]:{[".".concat(o,"-col-lg-24").concat(n,"-label")]:E(e)}}}},A=(e,t)=>(0,g.h1)(e,{formItemCls:"".concat(e.componentCls,"-item"),rootPrefixCls:t}),I=(0,h.OF)("Form",((e,t)=>{let{rootPrefixCls:n}=t;const o=A(e,n);return[x(o),w(o),b(o),C(o),O(o),S(o),(0,m.A)(o),p.nF]}),(e=>({labelRequiredMarkColor:e.colorError,labelColor:e.colorTextHeading,labelFontSize:e.fontSize,labelHeight:e.controlHeight,labelColonMarginInlineStart:e.marginXXS/2,labelColonMarginInlineEnd:e.marginXS,itemMarginBottom:e.marginLG,verticalLabelPadding:"0 0 ".concat(e.paddingXS,"px"),verticalLabelMargin:0})),{order:-1e3});var k=n(78887);const M=[];function F(e,t,n){let o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;return{key:"string"===typeof e?e:"".concat(t,"-").concat(o),error:e,errorStatus:n}}const N=e=>{let{help:t,helpStatus:n,errors:r=M,warnings:u=M,className:f,fieldId:p,onVisibleChanged:m}=e;const{prefixCls:g}=l.useContext(s.hb),h="".concat(g,"-item-explain"),b=(0,k.A)(g),[y,v,x]=I(g,b),w=(0,l.useMemo)((()=>(0,i.A)(g)),[g]),C=d(r),O=d(u),E=l.useMemo((()=>void 0!==t&&null!==t?[F(t,"help",n)]:[].concat((0,o.A)(C.map(((e,t)=>F(e,"error","error",t)))),(0,o.A)(O.map(((e,t)=>F(e,"warning","warning",t)))))),[t,n,C,O]),j={};return p&&(j.id="".concat(p,"_help")),y(l.createElement(c.Ay,{motionDeadline:w.motionDeadline,motionName:"".concat(g,"-show-help"),visible:!!E.length,onVisibleChanged:m},(e=>{const{className:t,style:n}=e;return l.createElement("div",Object.assign({},j,{className:a()(h,t,x,b,f,v),style:n,role:"alert"}),l.createElement(c.aF,Object.assign({keys:E},(0,i.A)(g),{motionName:"".concat(g,"-show-help-item"),component:!1}),(e=>{const{key:t,error:n,errorStatus:o,className:r,style:c}=e;return l.createElement("div",{key:t,className:a()(r,{["".concat(h,"-").concat(o)]:o}),style:c},n)})))})))};var P=n(87511),W=n(35296),R=n(78440),z=n(89122),H=n(87063);const q=e=>"object"==typeof e&&null!=e&&1===e.nodeType,_=(e,t)=>(!t||"hidden"!==e)&&"visible"!==e&&"clip"!==e,T=(e,t)=>{if(e.clientHeight<e.scrollHeight||e.clientWidth<e.scrollWidth){const n=getComputedStyle(e,null);return _(n.overflowY,t)||_(n.overflowX,t)||(e=>{const t=(e=>{if(!e.ownerDocument||!e.ownerDocument.defaultView)return null;try{return e.ownerDocument.defaultView.frameElement}catch(e){return null}})(e);return!!t&&(t.clientHeight<e.scrollHeight||t.clientWidth<e.scrollWidth)})(e)}return!1},L=(e,t,n,o,r,a,c,l)=>a<e&&c>t||a>e&&c<t?0:a<=e&&l<=n||c>=t&&l>=n?a-e-o:c>t&&l<n||a<e&&l>n?c-t+r:0,D=e=>{const t=e.parentElement;return null==t?e.getRootNode().host||null:t},B=(e,t)=>{var n,o,r,a;if("undefined"==typeof document)return[];const{scrollMode:c,block:l,inline:i,boundary:s,skipOverflowHiddenElements:d}=t,u="function"==typeof s?s:e=>e!==s;if(!q(e))throw new TypeError("Invalid target");const f=document.scrollingElement||document.documentElement,p=[];let m=e;for(;q(m)&&u(m);){if(m=D(m),m===f){p.push(m);break}null!=m&&m===document.body&&T(m)&&!T(document.documentElement)||null!=m&&T(m,d)&&p.push(m)}const g=null!=(o=null==(n=window.visualViewport)?void 0:n.width)?o:innerWidth,h=null!=(a=null==(r=window.visualViewport)?void 0:r.height)?a:innerHeight,{scrollX:b,scrollY:y}=window,{height:v,width:x,top:w,right:C,bottom:O,left:E}=e.getBoundingClientRect(),{top:j,right:S,bottom:A,left:I}=(e=>{const t=window.getComputedStyle(e);return{top:parseFloat(t.scrollMarginTop)||0,right:parseFloat(t.scrollMarginRight)||0,bottom:parseFloat(t.scrollMarginBottom)||0,left:parseFloat(t.scrollMarginLeft)||0}})(e);let k="start"===l||"nearest"===l?w-j:"end"===l?O+A:w+v/2-j+A,M="center"===i?E+x/2-I+S:"end"===i?C+S:E-I;const F=[];for(let N=0;N<p.length;N++){const e=p[N],{height:t,width:n,top:o,right:r,bottom:a,left:s}=e.getBoundingClientRect();if("if-needed"===c&&w>=0&&E>=0&&O<=h&&C<=g&&w>=o&&O<=a&&E>=s&&C<=r)return F;const d=getComputedStyle(e),u=parseInt(d.borderLeftWidth,10),m=parseInt(d.borderTopWidth,10),j=parseInt(d.borderRightWidth,10),S=parseInt(d.borderBottomWidth,10);let A=0,I=0;const P="offsetWidth"in e?e.offsetWidth-e.clientWidth-u-j:0,W="offsetHeight"in e?e.offsetHeight-e.clientHeight-m-S:0,R="offsetWidth"in e?0===e.offsetWidth?0:n/e.offsetWidth:0,z="offsetHeight"in e?0===e.offsetHeight?0:t/e.offsetHeight:0;if(f===e)A="start"===l?k:"end"===l?k-h:"nearest"===l?L(y,y+h,h,m,S,y+k,y+k+v,v):k-h/2,I="start"===i?M:"center"===i?M-g/2:"end"===i?M-g:L(b,b+g,g,u,j,b+M,b+M+x,x),A=Math.max(0,A+y),I=Math.max(0,I+b);else{A="start"===l?k-o-m:"end"===l?k-a+S+W:"nearest"===l?L(o,a,t,m,S+W,k,k+v,v):k-(o+t/2)+W/2,I="start"===i?M-s-u:"center"===i?M-(s+n/2)+P/2:"end"===i?M-r+j+P:L(s,r,n,u,j+P,M,M+x,x);const{scrollLeft:c,scrollTop:d}=e;A=0===z?0:Math.max(0,Math.min(d+A/z,e.scrollHeight-t/z+W)),I=0===R?0:Math.max(0,Math.min(c+I/R,e.scrollWidth-n/R+P)),k+=d-A,M+=c-I}F.push({el:e,top:A,left:I})}return F},V=e=>!1===e?{block:"end",inline:"nearest"}:(e=>e===Object(e)&&0!==Object.keys(e).length)(e)?e:{block:"start",inline:"nearest"};const X=["parentNode"],K="form_item";function G(e){return void 0===e||!1===e?[]:Array.isArray(e)?e:[e]}function $(e,t){if(!e.length)return;const n=e.join("_");if(t)return"".concat(t,"_").concat(n);return X.includes(n)?"".concat(K,"_").concat(n):n}function Q(e,t,n,o,r,a){let c=o;return void 0!==a?c=a:n.validating?c="validating":e.length?c="error":t.length?c="warning":(n.touched||r&&n.validated)&&(c="success"),c}function Y(e){return G(e).join("_")}function J(e){const[t]=(0,P.mN)(),n=l.useRef({}),o=l.useMemo((()=>null!==e&&void 0!==e?e:Object.assign(Object.assign({},t),{__INTERNAL__:{itemRef:e=>t=>{const o=Y(e);t?n.current[o]=t:delete n.current[o]}},scrollToField:function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=$(G(e),o.__INTERNAL__.name),r=n?document.getElementById(n):null;r&&function(e,t){if(!e.isConnected||!(e=>{let t=e;for(;t&&t.parentNode;){if(t.parentNode===document)return!0;t=t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}return!1})(e))return;const n=(e=>{const t=window.getComputedStyle(e);return{top:parseFloat(t.scrollMarginTop)||0,right:parseFloat(t.scrollMarginRight)||0,bottom:parseFloat(t.scrollMarginBottom)||0,left:parseFloat(t.scrollMarginLeft)||0}})(e);if((e=>"object"==typeof e&&"function"==typeof e.behavior)(t))return t.behavior(B(e,t));const o="boolean"==typeof t||null==t?void 0:t.behavior;for(const{el:r,top:a,left:c}of B(e,V(t))){const e=a-n.top+n.bottom,t=c-n.left+n.right;r.scroll({top:e,left:t,behavior:o})}}(r,Object.assign({scrollMode:"if-needed",block:"nearest"},t))},getFieldInstance:e=>{const t=Y(e);return n.current[t]}})),[e,t]);return[o]}var U=n(53130),Z=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};const ee=(e,t)=>{const n=l.useContext(R.A),{getPrefixCls:o,direction:r,form:c}=l.useContext(W.QO),{prefixCls:i,className:d,rootClassName:u,size:f,disabled:p=n,form:m,colon:g,labelAlign:h,labelWrap:b,labelCol:y,wrapperCol:v,hideRequiredMark:x,layout:w="horizontal",scrollToFirstError:C,requiredMark:O,onFinishFailed:E,name:j,style:S,feedbackIcons:A,variant:M}=e,F=Z(e,["prefixCls","className","rootClassName","size","disabled","form","colon","labelAlign","labelWrap","labelCol","wrapperCol","hideRequiredMark","layout","scrollToFirstError","requiredMark","onFinishFailed","name","style","feedbackIcons","variant"]),N=(0,z.A)(f),q=l.useContext(U.A);const _=(0,l.useMemo)((()=>void 0!==O?O:!x&&(!c||void 0===c.requiredMark||c.requiredMark)),[x,O,c]),T=null!==g&&void 0!==g?g:null===c||void 0===c?void 0:c.colon,L=o("form",i),D=(0,k.A)(L),[B,V,X]=I(L,D),K=a()(L,"".concat(L,"-").concat(w),{["".concat(L,"-hide-required-mark")]:!1===_,["".concat(L,"-rtl")]:"rtl"===r,["".concat(L,"-").concat(N)]:N},X,D,V,null===c||void 0===c?void 0:c.className,d,u),[G]=J(m),{__INTERNAL__:$}=G;$.name=j;const Q=(0,l.useMemo)((()=>({name:j,labelAlign:h,labelCol:y,labelWrap:b,wrapperCol:v,vertical:"vertical"===w,colon:T,requiredMark:_,itemRef:$.itemRef,form:G,feedbackIcons:A})),[j,h,y,v,w,T,_,G,A]);l.useImperativeHandle(t,(()=>G));const Y=(e,t)=>{if(e){let n={block:"nearest"};"object"===typeof e&&(n=e),G.scrollToField(t,n)}};return B(l.createElement(s.Pp.Provider,{value:M},l.createElement(R.X,{disabled:p},l.createElement(H.A.Provider,{value:N},l.createElement(s.Op,{validateMessages:q},l.createElement(s.cK.Provider,{value:Q},l.createElement(P.Ay,Object.assign({id:j},F,{name:j,onFinishFailed:e=>{if(null===E||void 0===E||E(e),e.errorFields.length){const t=e.errorFields[0].name;if(void 0!==C)return void Y(C,t);c&&void 0!==c.scrollToFirstError&&Y(c.scrollToFirstError,t)}},form:G,style:Object.assign(Object.assign({},null===c||void 0===c?void 0:c.style),S),className:K}))))))))};const te=l.forwardRef(ee);var ne=n(8566),oe=n(13758),re=n(12701),ae=n(59478),ce=n(62149);const le=()=>{const{status:e,errors:t=[],warnings:n=[]}=(0,l.useContext)(s.$W);return{status:e,errors:t,warnings:n}};le.Context=s.$W;const ie=le;var se=n(45818);var de=n(76590),ue=n(52664),fe=n(18574),pe=n(28821),me=n(30227);const ge=e=>{const{formItemCls:t}=e;return{"@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)":{["".concat(t,"-control")]:{display:"flex"}}}},he=(0,h.bf)(["Form","item-item"],((e,t)=>{let{rootPrefixCls:n}=t;const o=A(e,n);return[ge(o)]})),be=e=>{const{prefixCls:t,status:n,wrapperCol:o,children:r,errors:c,warnings:i,_internalItemRender:d,extra:u,help:f,fieldId:p,marginBottom:m,onErrorVisibleChanged:g}=e,h="".concat(t,"-item"),b=l.useContext(s.cK),y=o||b.wrapperCol||{},v=a()("".concat(h,"-control"),y.className),x=l.useMemo((()=>Object.assign({},b)),[b]);delete x.labelCol,delete x.wrapperCol;const w=l.createElement("div",{className:"".concat(h,"-control-input")},l.createElement("div",{className:"".concat(h,"-control-input-content")},r)),C=l.useMemo((()=>({prefixCls:t,status:n})),[t,n]),O=null!==m||c.length||i.length?l.createElement("div",{style:{display:"flex",flexWrap:"nowrap"}},l.createElement(s.hb.Provider,{value:C},l.createElement(N,{fieldId:p,errors:c,warnings:i,help:f,helpStatus:n,className:"".concat(h,"-explain-connected"),onVisibleChanged:g})),!!m&&l.createElement("div",{style:{width:0,height:m}})):null,E={};p&&(E.id="".concat(p,"_extra"));const j=u?l.createElement("div",Object.assign({},E,{className:"".concat(h,"-extra")}),u):null,S=d&&"pro_table_render"===d.mark&&d.render?d.render(e,{input:w,errorList:O,extra:j}):l.createElement(l.Fragment,null,w,O,j);return l.createElement(s.cK.Provider,{value:x},l.createElement(me.A,Object.assign({},y,{className:v}),S),l.createElement(he,{prefixCls:t}))};var ye=n(58168);const ve={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"}},{tag:"path",attrs:{d:"M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"question-circle",theme:"outlined"};var xe=n(22172),we=function(e,t){return l.createElement(xe.A,(0,ye.A)({},e,{ref:t,icon:ve}))};const Ce=l.forwardRef(we);var Oe=n(47451),Ee=n(10370),je=n(96651),Se=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};const Ae=e=>{let{prefixCls:t,label:n,htmlFor:o,labelCol:r,labelAlign:c,colon:i,required:d,requiredMark:u,tooltip:f}=e;var p;const[m]=(0,Ee.A)("Form"),{vertical:g,labelAlign:h,labelCol:b,labelWrap:y,colon:v}=l.useContext(s.cK);if(!n)return null;const x=r||b||{},w=c||h,C="".concat(t,"-item-label"),O=a()(C,"left"===w&&"".concat(C,"-left"),x.className,{["".concat(C,"-wrap")]:!!y});let E=n;const j=!0===i||!1!==v&&!1!==i;j&&!g&&"string"===typeof n&&""!==n.trim()&&(E=n.replace(/[:|\uff1a]\s*$/,""));const S=function(e){return e?"object"!==typeof e||l.isValidElement(e)?{title:e}:e:null}(f);if(S){const{icon:e=l.createElement(Ce,null)}=S,n=Se(S,["icon"]),o=l.createElement(je.A,Object.assign({},n),l.cloneElement(e,{className:"".concat(t,"-item-tooltip"),title:"",onClick:e=>{e.preventDefault()},tabIndex:null}));E=l.createElement(l.Fragment,null,E,o)}const A="optional"===u,I="function"===typeof u;I?E=u(E,{required:!!d}):A&&!d&&(E=l.createElement(l.Fragment,null,E,l.createElement("span",{className:"".concat(t,"-item-optional"),title:""},(null===m||void 0===m?void 0:m.optional)||(null===(p=Oe.A.Form)||void 0===p?void 0:p.optional))));const k=a()({["".concat(t,"-item-required")]:d,["".concat(t,"-item-required-mark-optional")]:A||I,["".concat(t,"-item-no-colon")]:!j});return l.createElement(me.A,Object.assign({},x,{className:O}),l.createElement("label",{htmlFor:o,className:k,title:"string"===typeof n?n:""},E))};var Ie=n(12499),ke=n(78528),Me=n(51376),Fe=n(40164);const Ne={success:Ie.A,warning:Me.A,error:ke.A,validating:Fe.A};function Pe(e){let{children:t,errors:n,warnings:o,hasFeedback:r,validateStatus:c,prefixCls:i,meta:d,noStyle:u}=e;const f="".concat(i,"-item"),{feedbackIcons:p}=l.useContext(s.cK),m=Q(n,o,d,null,!!r,c),{isFormItemInput:g,status:h,hasFeedback:b,feedbackIcon:y}=l.useContext(s.$W),v=l.useMemo((()=>{var e;let t;if(r){const c=!0!==r&&r.icons||p,i=m&&(null===(e=null===c||void 0===c?void 0:c({status:m,errors:n,warnings:o}))||void 0===e?void 0:e[m]),s=m&&Ne[m];t=!1!==i&&s?l.createElement("span",{className:a()("".concat(f,"-feedback-icon"),"".concat(f,"-feedback-icon-").concat(m))},i||l.createElement(s,null)):null}const c={status:m||"",errors:n,warnings:o,hasFeedback:!!r,feedbackIcon:t,isFormItemInput:!0};return u&&(c.status=(null!==m&&void 0!==m?m:h)||"",c.isFormItemInput=g,c.hasFeedback=!!(null!==r&&void 0!==r?r:b),c.feedbackIcon=void 0!==r?c.feedbackIcon:y),c}),[m,r,u,g,h]);return l.createElement(s.$W.Provider,{value:v},t)}var We=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};function Re(e){const{prefixCls:t,className:n,rootClassName:o,style:r,help:c,errors:i,warnings:u,validateStatus:f,meta:p,hasFeedback:m,hidden:g,children:h,fieldId:b,required:y,isRequired:v,onSubItemMetaChange:x}=e,w=We(e,["prefixCls","className","rootClassName","style","help","errors","warnings","validateStatus","meta","hasFeedback","hidden","children","fieldId","required","isRequired","onSubItemMetaChange"]),C="".concat(t,"-item"),{requiredMark:O}=l.useContext(s.cK),E=l.useRef(null),j=d(i),S=d(u),A=void 0!==c&&null!==c,I=!!(A||i.length||u.length),k=!!E.current&&(0,de.A)(E.current),[M,F]=l.useState(null);(0,ue.A)((()=>{if(I&&E.current){const e=getComputedStyle(E.current);F(parseInt(e.marginBottom,10))}}),[I,k]);const N=function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return Q(e?j:p.errors,e?S:p.warnings,p,"",!!m,f)}(),P=a()(C,n,o,{["".concat(C,"-with-help")]:A||j.length||S.length,["".concat(C,"-has-feedback")]:N&&m,["".concat(C,"-has-success")]:"success"===N,["".concat(C,"-has-warning")]:"warning"===N,["".concat(C,"-has-error")]:"error"===N,["".concat(C,"-is-validating")]:"validating"===N,["".concat(C,"-hidden")]:g});return l.createElement("div",{className:P,style:r,ref:E},l.createElement(pe.A,Object.assign({className:"".concat(C,"-row")},(0,fe.A)(w,["_internalItemRender","colon","dependencies","extra","fieldKey","getValueFromEvent","getValueProps","htmlFor","id","initialValue","isListField","label","labelAlign","labelCol","labelWrap","messageVariables","name","normalize","noStyle","preserve","requiredMark","rules","shouldUpdate","trigger","tooltip","validateFirst","validateTrigger","valuePropName","wrapperCol","validateDebounce"])),l.createElement(Ae,Object.assign({htmlFor:b},e,{requiredMark:O,required:null!==y&&void 0!==y?y:v,prefixCls:t})),l.createElement(be,Object.assign({},e,p,{errors:j,warnings:S,prefixCls:t,status:N,help:c,marginBottom:M,onErrorVisibleChanged:e=>{e||F(null)}}),l.createElement(s.jC.Provider,{value:x},l.createElement(Pe,{prefixCls:t,meta:p,errors:p.errors,warnings:p.warnings,hasFeedback:m,validateStatus:N},h)))),!!M&&l.createElement("div",{className:"".concat(C,"-margin-offset"),style:{marginBottom:-M}}))}const ze=l.memo((e=>{let{children:t}=e;return t}),((e,t)=>function(e,t){const n=Object.keys(e),o=Object.keys(t);return n.length===o.length&&n.every((n=>{const o=e[n],r=t[n];return o===r||"function"===typeof o||"function"===typeof r}))}(e.control,t.control)&&e.update===t.update&&e.childProps.length===t.childProps.length&&e.childProps.every(((e,n)=>e===t.childProps[n]))));const He=function(e){const{name:t,noStyle:n,className:r,dependencies:c,prefixCls:i,shouldUpdate:d,rules:u,children:f,required:p,label:m,messageVariables:g,trigger:h="onChange",validateTrigger:b,hidden:y,help:v}=e,{getPrefixCls:x}=l.useContext(W.QO),{name:w}=l.useContext(s.cK),C=function(e){if("function"===typeof e)return e;const t=(0,ce.A)(e);return t.length<=1?t[0]:t}(f),O="function"===typeof C,E=l.useContext(s.jC),{validateTrigger:j}=l.useContext(P._z),S=void 0!==b?b:j,A=!(void 0===t||null===t),M=x("form",i),F=(0,k.A)(M),[N,R,z]=I(M,F);(0,ae.rJ)("Form.Item");const H=l.useContext(P.EF),q=l.useRef(),[_,T]=function(e){const[t,n]=l.useState(e),o=(0,l.useRef)(null),r=(0,l.useRef)([]),a=(0,l.useRef)(!1);return l.useEffect((()=>(a.current=!1,()=>{a.current=!0,se.A.cancel(o.current),o.current=null})),[]),[t,function(e){a.current||(null===o.current&&(r.current=[],o.current=(0,se.A)((()=>{o.current=null,n((e=>{let t=e;return r.current.forEach((e=>{t=e(t)})),t}))}))),r.current.push(e))}]}({}),[L,D]=(0,ne.A)((()=>({errors:[],warnings:[],touched:!1,validating:!1,name:[],validated:!1}))),B=(e,t)=>{T((n=>{const r=Object.assign({},n),a=[].concat((0,o.A)(e.name.slice(0,-1)),(0,o.A)(t)).join("__SPLIT__");return e.destroy?delete r[a]:r[a]=e,r}))},[V,X]=l.useMemo((()=>{const e=(0,o.A)(L.errors),t=(0,o.A)(L.warnings);return Object.values(_).forEach((n=>{e.push.apply(e,(0,o.A)(n.errors||[])),t.push.apply(t,(0,o.A)(n.warnings||[]))})),[e,t]}),[_,L.errors,L.warnings]),K=function(){const{itemRef:e}=l.useContext(s.cK),t=l.useRef({});return function(n,o){const r=o&&"object"===typeof o&&o.ref,a=n.join("_");return t.current.name===a&&t.current.originRef===r||(t.current.name=a,t.current.originRef=r,t.current.ref=(0,oe.K4)(e(n),r)),t.current.ref}}();function Q(t,o,c){return n&&!y?l.createElement(Pe,{prefixCls:M,hasFeedback:e.hasFeedback,validateStatus:e.validateStatus,meta:L,errors:V,warnings:X,noStyle:!0},t):l.createElement(Re,Object.assign({key:"row"},e,{className:a()(r,z,F,R),prefixCls:M,fieldId:o,isRequired:c,errors:V,warnings:X,meta:L,onSubItemMetaChange:B}),t)}if(!A&&!O&&!c)return N(Q(C));let Y={};return"string"===typeof m?Y.label=m:t&&(Y.label=String(t)),g&&(Y=Object.assign(Object.assign({},Y),g)),N(l.createElement(P.D0,Object.assign({},e,{messageVariables:Y,trigger:h,validateTrigger:S,onMetaChange:e=>{const t=null===H||void 0===H?void 0:H.getKey(e.name);if(D(e.destroy?{errors:[],warnings:[],touched:!1,validating:!1,name:[],validated:!1}:e,!0),n&&!1!==v&&E){let n=e.name;if(e.destroy)n=q.current||n;else if(void 0!==t){const[e,r]=t;n=[e].concat((0,o.A)(r)),q.current=n}E(e,n)}}}),((n,r,a)=>{const i=G(t).length&&r?r.name:[],s=$(i,w),f=void 0!==p?p:!(!u||!u.some((e=>{if(e&&"object"===typeof e&&e.required&&!e.warningOnly)return!0;if("function"===typeof e){const t=e(a);return t&&t.required&&!t.warningOnly}return!1}))),m=Object.assign({},n);let g=null;if(Array.isArray(C)&&A)g=C;else if(O&&(!d&&!c||A));else if(!c||O||A)if(l.isValidElement(C)){const t=Object.assign(Object.assign({},C.props),m);if(t.id||(t.id=s),v||V.length>0||X.length>0||e.extra){const n=[];(v||V.length>0)&&n.push("".concat(s,"_help")),e.extra&&n.push("".concat(s,"_extra")),t["aria-describedby"]=n.join(" ")}V.length>0&&(t["aria-invalid"]="true"),f&&(t["aria-required"]="true"),(0,oe.f3)(C)&&(t.ref=K(i,C));new Set([].concat((0,o.A)(G(h)),(0,o.A)(G(S)))).forEach((e=>{t[e]=function(){for(var t,n,o,r,a,c=arguments.length,l=new Array(c),i=0;i<c;i++)l[i]=arguments[i];null===(o=m[e])||void 0===o||(t=o).call.apply(t,[m].concat(l)),null===(a=(r=C.props)[e])||void 0===a||(n=a).call.apply(n,[r].concat(l))}}));const n=[t["aria-required"],t["aria-invalid"],t["aria-describedby"]];g=l.createElement(ze,{control:m,update:C,childProps:n},(0,re.Ob)(C,t))}else g=O&&(d||c)&&!A?C(a):C;else;return Q(g,s,f)})))};He.useStatus=ie;const qe=He;var _e=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};const Te=e=>{var{prefixCls:t,children:n}=e,o=_e(e,["prefixCls","children"]);const{getPrefixCls:r}=l.useContext(W.QO),a=r("form",t),c=l.useMemo((()=>({prefixCls:a,status:"error"})),[a]);return l.createElement(P.B8,Object.assign({},o),((e,t,o)=>l.createElement(s.hb.Provider,{value:c},n(e.map((e=>Object.assign(Object.assign({},e),{fieldKey:e.key}))),t,{errors:o.errors,warnings:o.warnings}))))};const Le=te;Le.Item=qe,Le.List=Te,Le.ErrorList=N,Le.useForm=J,Le.useFormInstance=function(){const{form:e}=(0,l.useContext)(s.cK);return e},Le.useWatch=P.FH,Le.Provider=s.Op,Le.create=()=>{};const De=Le},95150:(e,t,n)=>{n.d(t,{A:()=>o});const o=(0,n(65043).createContext)({})},30227:(e,t,n)=>{n.d(t,{A:()=>f});var o=n(65043),r=n(98139),a=n.n(r),c=n(35296),l=n(95150),i=n(56055),s=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};function d(e){return"number"===typeof e?"".concat(e," ").concat(e," auto"):/^\d+(\.\d+)?(px|em|rem|%)$/.test(e)?"0 0 ".concat(e):e}const u=["xs","sm","md","lg","xl","xxl"];const f=o.forwardRef(((e,t)=>{const{getPrefixCls:n,direction:r}=o.useContext(c.QO),{gutter:f,wrap:p}=o.useContext(l.A),{prefixCls:m,span:g,order:h,offset:b,push:y,pull:v,className:x,children:w,flex:C,style:O}=e,E=s(e,["prefixCls","span","order","offset","push","pull","className","children","flex","style"]),j=n("col",m),[S,A,I]=(0,i.xV)(j),k={};let M={};u.forEach((t=>{let n={};const o=e[t];"number"===typeof o?n.span=o:"object"===typeof o&&(n=o||{}),delete E[t],M=Object.assign(Object.assign({},M),{["".concat(j,"-").concat(t,"-").concat(n.span)]:void 0!==n.span,["".concat(j,"-").concat(t,"-order-").concat(n.order)]:n.order||0===n.order,["".concat(j,"-").concat(t,"-offset-").concat(n.offset)]:n.offset||0===n.offset,["".concat(j,"-").concat(t,"-push-").concat(n.push)]:n.push||0===n.push,["".concat(j,"-").concat(t,"-pull-").concat(n.pull)]:n.pull||0===n.pull,["".concat(j,"-rtl")]:"rtl"===r}),n.flex&&(M["".concat(j,"-").concat(t,"-flex")]=!0,k["--".concat(j,"-").concat(t,"-flex")]=d(n.flex))}));const F=a()(j,{["".concat(j,"-").concat(g)]:void 0!==g,["".concat(j,"-order-").concat(h)]:h,["".concat(j,"-offset-").concat(b)]:b,["".concat(j,"-push-").concat(y)]:y,["".concat(j,"-pull-").concat(v)]:v},x,M,A,I),N={};if(f&&f[0]>0){const e=f[0]/2;N.paddingLeft=e,N.paddingRight=e}return C&&(N.flex=d(C),!1!==p||N.minWidth||(N.minWidth=0)),S(o.createElement("div",Object.assign({},E,{style:Object.assign(Object.assign(Object.assign({},N),O),k),className:F,ref:t}),w))}))},28821:(e,t,n)=>{n.d(t,{A:()=>f});var o=n(65043),r=n(98139),a=n.n(r),c=n(44320),l=n(35296),i=n(95150),s=n(56055),d=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};function u(e,t){const[n,r]=o.useState("string"===typeof e?e:"");return o.useEffect((()=>{(()=>{if("string"===typeof e&&r(e),"object"===typeof e)for(let n=0;n<c.ye.length;n++){const o=c.ye[n];if(!t[o])continue;const a=e[o];if(void 0!==a)return void r(a)}})()}),[JSON.stringify(e),t]),n}const f=o.forwardRef(((e,t)=>{const{prefixCls:n,justify:r,align:f,className:p,style:m,children:g,gutter:h=0,wrap:b}=e,y=d(e,["prefixCls","justify","align","className","style","children","gutter","wrap"]),{getPrefixCls:v,direction:x}=o.useContext(l.QO),[w,C]=o.useState({xs:!0,sm:!0,md:!0,lg:!0,xl:!0,xxl:!0}),[O,E]=o.useState({xs:!1,sm:!1,md:!1,lg:!1,xl:!1,xxl:!1}),j=u(f,O),S=u(r,O),A=o.useRef(h),I=(0,c.Ay)();o.useEffect((()=>{const e=I.subscribe((e=>{E(e);const t=A.current||0;(!Array.isArray(t)&&"object"===typeof t||Array.isArray(t)&&("object"===typeof t[0]||"object"===typeof t[1]))&&C(e)}));return()=>I.unsubscribe(e)}),[]);const k=v("row",n),[M,F,N]=(0,s.L3)(k),P=(()=>{const e=[void 0,void 0];return(Array.isArray(h)?h:[h,void 0]).forEach(((t,n)=>{if("object"===typeof t)for(let o=0;o<c.ye.length;o++){const r=c.ye[o];if(w[r]&&void 0!==t[r]){e[n]=t[r];break}}else e[n]=t})),e})(),W=a()(k,{["".concat(k,"-no-wrap")]:!1===b,["".concat(k,"-").concat(S)]:S,["".concat(k,"-").concat(j)]:j,["".concat(k,"-rtl")]:"rtl"===x},p,F,N),R={},z=null!=P[0]&&P[0]>0?P[0]/-2:void 0;z&&(R.marginLeft=z,R.marginRight=z);const[H,q]=P;R.rowGap=q;const _=o.useMemo((()=>({gutter:[H,q],wrap:b})),[H,q,b]);return M(o.createElement(i.A.Provider,{value:_},o.createElement("div",Object.assign({},y,{className:W,style:Object.assign(Object.assign({},R),m),ref:t}),g)))}))},56055:(e,t,n)=>{n.d(t,{L3:()=>i,xV:()=>s});var o=n(36647),r=n(7060),a=n(78365);const c=e=>{const{componentCls:t}=e;return{[t]:{position:"relative",maxWidth:"100%",minHeight:1}}},l=(e,t)=>((e,t)=>{const{prefixCls:n,componentCls:o,gridColumns:r}=e,a={};for(let c=r;c>=0;c--)0===c?(a["".concat(o).concat(t,"-").concat(c)]={display:"none"},a["".concat(o,"-push-").concat(c)]={insetInlineStart:"auto"},a["".concat(o,"-pull-").concat(c)]={insetInlineEnd:"auto"},a["".concat(o).concat(t,"-push-").concat(c)]={insetInlineStart:"auto"},a["".concat(o).concat(t,"-pull-").concat(c)]={insetInlineEnd:"auto"},a["".concat(o).concat(t,"-offset-").concat(c)]={marginInlineStart:0},a["".concat(o).concat(t,"-order-").concat(c)]={order:0}):(a["".concat(o).concat(t,"-").concat(c)]=[{"--ant-display":"block",display:"block"},{display:"var(--ant-display)",flex:"0 0 ".concat(c/r*100,"%"),maxWidth:"".concat(c/r*100,"%")}],a["".concat(o).concat(t,"-push-").concat(c)]={insetInlineStart:"".concat(c/r*100,"%")},a["".concat(o).concat(t,"-pull-").concat(c)]={insetInlineEnd:"".concat(c/r*100,"%")},a["".concat(o).concat(t,"-offset-").concat(c)]={marginInlineStart:"".concat(c/r*100,"%")},a["".concat(o).concat(t,"-order-").concat(c)]={order:c});return a["".concat(o).concat(t,"-flex")]={flex:"var(--".concat(n).concat(t,"-flex)")},a})(e,t),i=(0,r.OF)("Grid",(e=>{const{componentCls:t}=e;return{[t]:{display:"flex",flexFlow:"row wrap",minWidth:0,"&::before, &::after":{display:"flex"},"&-no-wrap":{flexWrap:"nowrap"},"&-start":{justifyContent:"flex-start"},"&-center":{justifyContent:"center"},"&-end":{justifyContent:"flex-end"},"&-space-between":{justifyContent:"space-between"},"&-space-around":{justifyContent:"space-around"},"&-space-evenly":{justifyContent:"space-evenly"},"&-top":{alignItems:"flex-start"},"&-middle":{alignItems:"center"},"&-bottom":{alignItems:"flex-end"}}}}),(()=>({}))),s=(0,r.OF)("Grid",(e=>{const t=(0,a.h1)(e,{gridColumns:24}),n={"-sm":t.screenSMMin,"-md":t.screenMDMin,"-lg":t.screenLGMin,"-xl":t.screenXLMin,"-xxl":t.screenXXLMin};return[c(t),l(t,""),l(t,"-xs"),Object.keys(n).map((e=>((e,t,n)=>({["@media (min-width: ".concat((0,o.zA)(t),")")]:Object.assign({},l(e,n))}))(t,n[e],e))).reduce(((e,t)=>Object.assign(Object.assign({},e),t)),{})]}),(()=>({})))}}]);
//# sourceMappingURL=748.ccbb04ea.chunk.js.map