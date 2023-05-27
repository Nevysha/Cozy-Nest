ace.define("cozy/nest/cozy-json", ["require", "exports", "module", "ace/lib/dom"], function (acequire, exports, module) {

    exports.isDark = true;
    exports.cssClass = "cozy-json-theme";
    exports.cssText = ".cozy-json-theme .ace_gutter {\
background: #1a0005;\
color: steelblue\
}\
.cozy-json-theme .ace_print-margin {\
width: 1px;\
background: #1a1a1a\
}\
.cozy-json-theme {\
background-color: black;\
color: #DEDEDE\
}\
.cozy-json-theme .ace_cursor {\
color: #9F9F9F\
}\
.cozy-json-theme .ace_marker-layer .ace_selection {\
background: #424242\
}\
.cozy-json-theme.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px black;\
}\
.cozy-json-theme .ace_marker-layer .ace_step {\
background: rgb(0, 0, 0)\
}\
.cozy-json-theme .ace_marker-layer .ace_bracket {\
background: #090;\
}\
.cozy-json-theme .ace_marker-layer .ace_bracket-start {\
background: #090;\
}\
.cozy-json-theme .ace_marker-layer .ace_bracket-unmatched {\
margin: -1px 0 0 -1px;\
border: 1px solid #900\
}\
.cozy-json-theme .ace_marker-layer .ace_active-line {\
background: #2A2A2A\
}\
.cozy-json-theme .ace_gutter-active-line {\
background-color: #2A112A\
}\
.cozy-json-theme .ace_marker-layer .ace_selected-word {\
border: 1px solid #424242\
}\
.cozy-json-theme .ace_invisible {\
color: #343434\
}\
.cozy-json-theme .ace_keyword,\
.cozy-json-theme .ace_meta,\
.cozy-json-theme .ace_storage,\
.cozy-json-theme .ace_storage.ace_type,\
.cozy-json-theme .ace_support.ace_type {\
color: tomato\
}\
.cozy-json-theme .ace_keyword.ace_operator {\
color: deeppink\
}\
.cozy-json-theme .ace_constant.ace_character,\
.cozy-json-theme .ace_constant.ace_language,\
.cozy-json-theme .ace_constant.ace_numeric,\
.cozy-json-theme .ace_keyword.ace_other.ace_unit,\
.cozy-json-theme .ace_support.ace_constant,\
.cozy-json-theme .ace_variable.ace_parameter {\
color: #E78C45\
}\
.cozy-json-theme .ace_constant.ace_other {\
color: gold\
}\
.cozy-json-theme .ace_invalid {\
color: yellow;\
background-color: red\
}\
.cozy-json-theme .ace_invalid.ace_deprecated {\
color: #CED2CF;\
background-color: #B798BF\
}\
.cozy-json-theme .ace_fold {\
background-color: #7AA6DA;\
border-color: #DEDEDE\
}\
.cozy-json-theme .ace_entity.ace_name.ace_function,\
.cozy-json-theme .ace_support.ace_function,\
.cozy-json-theme .ace_variable {\
color: #7AA6DA\
}\
.cozy-json-theme .ace_support.ace_class,\
.cozy-json-theme .ace_support.ace_type {\
color: #E7C547\
}\
.cozy-json-theme .ace_heading,\
.cozy-json-theme .ace_string {\
color: #B9CA4A\
}\
.cozy-json-theme .ace_entity.ace_name.ace_tag,\
.cozy-json-theme .ace_entity.ace_other.ace_attribute-name,\
.cozy-json-theme .ace_meta.ace_tag,\
.cozy-json-theme .ace_string.ace_regexp,\
.cozy-json-theme .ace_variable {\
color: #D54E53\
}\
.cozy-json-theme .ace_comment {\
color: orangered\
}\
.cozy-json-theme .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYLBWV/8PAAK4AYnhiq+xAAAAAElFTkSuQmCC) right repeat-y;\
}\
";

    var dom = acequire("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
