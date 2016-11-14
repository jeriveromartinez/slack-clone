(function () {
    "use strict";
    CodeMirror.switchSlackMode = function (editor, mode) {
        var type_map = {
            c: ["clike", "text/x-csrc"],
            clojure: ["clojure", "text/x-clojure"],
            coffeescript: ["coffeescript", "text/x-coffeescript"],
            commonlisp: ["commonlisp", "text/x-commonlisp"],
            cpp: ["clike", "text/x-c++src"],
            crystal: ["crystal", "text/x-crystal"],
            csharp: ["clike", "text/x-csharp"],
            css: ["css", "text/css"],
            cypher: ["cypher", "x-cypher-query"],
            d: ["d", "text/x-d"],
            dart: ["dart", "text/x-dart"],
            diff: ["diff", "text/x-diff"],
            dockerfile: ["dockerfile", "text/x-dockerfile"],
            erlang: ["erlang", "text/x-erlang"],
            fortran: ["fortran", "text/x-fortran"],
            fsharp: ["mllike", "text/x-fsharp"],
            gherkin: ["gherkin", "text/x-feature"],
            go: ["go", "text/x-go"],
            groovy: ["groovy", "text/x-groovy"],
            handlebars: ["handlebars", "text/x-handlebars"],
            haskell: ["haskell", "text/x-haskell"],
            haxe: ["haxe", "text/x-haxe"],
            html: ["htmlmixed", "text/html"],
            java: ["clike", "text/x-java"],
            javascript: ["javascript", "text/javascript"],
            json: ["javascript", "application/json"],
            julia: ["julia", "text/x-julia"],
            kotlin: ["clike", "text/x-kotlin"],
            latex: ["stex", "text/x-stex"],
            lisp: ["commonlisp", "text/x-lisp"],
            lua: ["lua", "text/x-lua"],
            markdown: ["markdown", "text/x-markdown"],
            mathematica: ["mathematica", "text/x-mathematica"],
            matlab: ["octave", "text/x-octave"],
            mumps: ["mumps", "text/x-mumps"],
            mysql: ["sql", "text/x-mysql"],
            objc: ["clike", "text/x-objectivec"],
            ocaml: ["mllike", "text/x-ocaml"],
            pascal: ["pascal", "text/x-pascal"],
            perl: ["perl", "text/x-perl"],
            php: ["php", "application/x-httpd-php"],
            pig: ["pig", "text/x-pig"],
            powershell: ["powershell", "text/x-powershell"],
            puppet: ["puppet", "text/x-puppet"],
            python: ["python", "text/x-python"],
            r: ["r", "text/x-rsrc"],
            ruby: ["ruby", "text/x-ruby"],
            rust: ["rust", "text/x-rustsrc"],
            sass: ["sass", "text/x-sass"],
            scala: ["clike", "text/x-scala"],
            scheme: ["scheme", "text/x-scheme"],
            shell: ["shell", "text/x-sh"],
            smalltalk: ["smalltalk", "text/x-stsrc"],
            sql: ["sql", "text/x-sql"],
            swift: ["swift", "text/x-swift"],
            vb: ["vb", "text/x-vb"],
            vbscript: ["vbscript", "text/vbscript"],
            velocity: ["velocity", "text/x-velocity"],
            verilog: ["verilog", "text/x-verilog"],
            xml: ["xml", "text/xml"],
            yaml: ["yaml", "text/x-yaml"]
        };
        if (type_map[mode]) {
            editor.setOption("mode", type_map[mode][1]);
            CodeMirror.autoLoadMode(editor, type_map[mode][0])
        } else {
            editor.setOption("mode", null)
        }
    };
    function codemirrorMap(file) {
        switch (file) {
            case"apl":
                return cdn_url + "/js/codemirror/mode/apl.js";
            case"asciiarmor":
                return cdn_url + "/js/codemirror/mode/asciiarmor.js";
            case"asn.1":
                return cdn_url + "/js/codemirror/mode/asn.1.js";
            case"asterisk":
                return cdn_url + "/js/codemirror/mode/asterisk.js";
            case"brainfuck":
                return cdn_url + "/js/codemirror/mode/brainfuck.js";
            case"clike":
                return cdn_url + "/js/codemirror/mode/clike.js";
            case"clojure":
                return cdn_url + "/js/codemirror/mode/clojure.js";
            case"cmake":
                return cdn_url + "/js/codemirror/mode/cmake.js";
            case"cobol":
                return cdn_url + "/js/codemirror/mode/cobol.js";
            case"coffeescript":
                return cdn_url + "/js/codemirror/mode/coffeescript.js";
            case"commonlisp":
                return cdn_url + "/js/codemirror/mode/commonlisp.js";
            case"css":
                return cdn_url + "/js/codemirror/mode/css.js";
            case"cypher":
                return cdn_url + "/js/codemirror/mode/cypher.js";
            case"d":
                return cdn_url + "/js/codemirror/mode/d.js";
            case"dart":
                return cdn_url + "/js/codemirror/mode/dart.js";
            case"diff":
                return cdn_url + "/js/codemirror/mode/diff.js";
            case"django":
                return cdn_url + "/js/codemirror/mode/django.js";
            case"dockerfile":
                return cdn_url + "/js/codemirror/mode/dockerfile.js";
            case"dtd":
                return cdn_url + "/js/codemirror/mode/dtd.js";
            case"dylan":
                return cdn_url + "/js/codemirror/mode/dylan.js";
            case"ebnf":
                return cdn_url + "/js/codemirror/mode/ebnf.js";
            case"ecl":
                return cdn_url + "/js/codemirror/mode/ecl.js";
            case"eiffel":
                return cdn_url + "/js/codemirror/mode/eiffel.js";
            case"elm":
                return cdn_url + "/js/codemirror/mode/elm.js";
            case"erlang":
                return cdn_url + "/js/codemirror/mode/erlang.js";
            case"factor":
                return cdn_url + "/js/codemirror/mode/factor.js";
            case"forth":
                return cdn_url + "/js/codemirror/mode/forth.js";
            case"fortran":
                return cdn_url + "/js/codemirror/mode/fortran.js";
            case"gas":
                return cdn_url + "/js/codemirror/mode/gas.js";
            case"gfm":
                return cdn_url + "/js/codemirror/mode/gfm.js";
            case"gherkin":
                return cdn_url + "/js/codemirror/mode/gherkin.js";
            case"go":
                return cdn_url + "/js/codemirror/mode/go.js";
            case"groovy":
                return cdn_url + "/js/codemirror/mode/groovy.js";
            case"haml":
                return cdn_url + "/js/codemirror/mode/haml.js";
            case"handlebars":
                return cdn_url + "/js/codemirror/mode/handlebars.js";
            case"haskell":
                return cdn_url + "/js/codemirror/mode/haskell.js";
            case"haxe":
                return cdn_url + "/js/codemirror/mode/haxe.js";
            case"htmlembedded":
                return cdn_url + "/js/codemirror/mode/htmlembedded.js";
            case"htmlmixed":
                return cdn_url + "/js/codemirror/mode/htmlmixed.js";
            case"http":
                return cdn_url + "/js/codemirror/mode/http.js";
            case"idl":
                return cdn_url + "/js/codemirror/mode/idl.js";
            case"jade":
                return cdn_url + "/js/codemirror/mode/jade.js";
            case"javascript":
                return cdn_url + "/js/codemirror/mode/javascript.js";
            case"jinja2":
                return cdn_url + "/js/codemirror/mode/jinja2.js";
            case"julia":
                return cdn_url + "/js/codemirror/mode/julia.js";
            case"livescript":
                return cdn_url + "/js/codemirror/mode/livescript.js";
            case"lua":
                return cdn_url + "/js/codemirror/mode/lua.js";
            case"markdown":
                return cdn_url + "/js/codemirror/mode/markdown.js";
            case"mathematica":
                return cdn_url + "/js/codemirror/mode/mathematica.js";
            case"mirc":
                return cdn_url + "/js/codemirror/mode/mirc.js";
            case"mllike":
                return cdn_url + "/js/codemirror/mode/mllike.js";
            case"modelica":
                return cdn_url + "/js/codemirror/mode/modelica.js";
            case"mscgen":
                return cdn_url + "/js/codemirror/mode/mscgen.js";
            case"mumps":
                return cdn_url + "/js/codemirror/mode/mumps.js";
            case"nginx":
                return cdn_url + "/js/codemirror/mode/nginx.js";
            case"nsis":
                return cdn_url + "/js/codemirror/mode/nsis.js";
            case"ntriples":
                return cdn_url + "/js/codemirror/mode/ntriples.js";
            case"octave":
                return cdn_url + "/js/codemirror/mode/octave.js";
            case"oz":
                return cdn_url + "/js/codemirror/mode/oz.js";
            case"pascal":
                return cdn_url + "/js/codemirror/mode/pascal.js";
            case"pegjs":
                return cdn_url + "/js/codemirror/mode/pegjs.js";
            case"perl":
                return cdn_url + "/js/codemirror/mode/perl.js";
            case"php":
                return cdn_url + "/js/codemirror/mode/php.js";
            case"pig":
                return cdn_url + "/js/codemirror/mode/pig.js";
            case"powershell":
                return cdn_url + "/js/codemirror/mode/powershell.js";
            case"properties":
                return cdn_url + "/js/codemirror/mode/properties.js";
            case"puppet":
                return cdn_url + "/js/codemirror/mode/puppet.js";
            case"python":
                return cdn_url + "/js/codemirror/mode/python.js";
            case"q":
                return cdn_url + "/js/codemirror/mode/q.js";
            case"r":
                return cdn_url + "/js/codemirror/mode/r.js";
            case"rpm":
                return cdn_url + "/js/codemirror/mode/rpm.js";
            case"rst":
                return cdn_url + "/js/codemirror/mode/rst.js";
            case"ruby":
                return cdn_url + "/js/codemirror/mode/ruby.js";
            case"rust":
                return cdn_url + "/js/codemirror/mode/rust.js";
            case"sass":
                return cdn_url + "/js/codemirror/mode/sass.js";
            case"scheme":
                return cdn_url + "/js/codemirror/mode/scheme.js";
            case"shell":
                return cdn_url + "/js/codemirror/mode/shell.js";
            case"sieve":
                return cdn_url + "/js/codemirror/mode/sieve.js";
            case"slim":
                return cdn_url + "/js/codemirror/mode/slim.js";
            case"smalltalk":
                return cdn_url + "/js/codemirror/mode/smalltalk.js";
            case"smarty":
                return cdn_url + "/js/codemirror/mode/smarty.js";
            case"solr":
                return cdn_url + "/js/codemirror/mode/solr.js";
            case"soy":
                return cdn_url + "/js/codemirror/mode/soy.js";
            case"sparql":
                return cdn_url + "/js/codemirror/mode/sparql.js";
            case"spreadsheet":
                return cdn_url + "/js/codemirror/mode/spreadsheet.js";
            case"sql":
                return cdn_url + "/js/codemirror/mode/sql.js";
            case"stex":
                return cdn_url + "/js/codemirror/mode/stex.js";
            case"stylus":
                return cdn_url + "/js/codemirror/mode/stylus.js";
            case"swift":
                return cdn_url + "/js/codemirror/mode/swift.js";
            case"tcl":
                return cdn_url + "/js/codemirror/mode/tcl.js";
            case"textile":
                return cdn_url + "/js/codemirror/mode/textile.js";
            case"tiddlywiki":
                return cdn_url + "/js/codemirror/mode/tiddlywiki.js";
            case"tiki":
                return cdn_url + "/js/codemirror/mode/tiki.js";
            case"toml":
                return cdn_url + "/js/codemirror/mode/toml.js";
            case"tornado":
                return cdn_url + "/js/codemirror/mode/tornado.js";
            case"troff":
                return cdn_url + "/js/codemirror/mode/troff.js";
            case"ttcn":
                return cdn_url + "/js/codemirror/mode/ttcn.js";
            case"ttcn-cfg":
                return cdn_url + "/js/codemirror/mode/ttcn-cfg.js";
            case"turtle":
                return cdn_url + "/js/codemirror/mode/turtle.js";
            case"twig":
                return cdn_url + "/js/codemirror/mode/twig.js";
            case"vb":
                return cdn_url + "/js/codemirror/mode/vb.js";
            case"vbscript":
                return cdn_url + "/js/codemirror/mode/vbscript.js";
            case"velocity":
                return cdn_url + "/js/codemirror/mode/velocity.js";
            case"verilog":
                return cdn_url + "/js/codemirror/mode/verilog.js";
            case"vhdl":
                return cdn_url + "/js/codemirror/mode/vhdl.js";
            case"vue":
                return cdn_url + "/js/codemirror/mode/vue.js";
            case"xml":
                return cdn_url + "/js/codemirror/mode/xml.js";
            case"xquery":
                return cdn_url + "/js/codemirror/mode/xquery.js";
            case"yaml":
                return cdn_url + "/js/codemirror/mode/yaml.js";
            case"z80":
                return cdn_url + "/js/codemirror/mode/z80.js"
        }
        return null
    }

    var loading = {};

    function splitCallback(cont, n) {
        var count_down = n;
        return function () {
            if (--count_down == 0)cont()
        }
    }

    function ensureDeps(mode, cont) {
        var deps = CodeMirror.modes[mode].dependencies;
        if (!deps)return cont();
        var missing = [];
        for (var i = 0; i < deps.length; ++i) {
            if (!CodeMirror.modes.hasOwnProperty(deps[i])) {
                missing.push(deps[i])
            }
        }
        if (!missing.length)return cont();
        var split = splitCallback(cont, missing.length);
        for (var i = 0; i < missing.length; ++i) {
            CodeMirror.requireMode(missing[i], split)
        }
    }

    CodeMirror.requireMode = function (mode, cont) {
        if (typeof mode != "string")mode = mode.name;
        if (CodeMirror.modes.hasOwnProperty(mode))return ensureDeps(mode, cont);
        if (loading.hasOwnProperty(mode))return loading[mode].push(cont);
        var script = document.createElement("script");
        script.src = codemirrorMap(mode);
        var others = document.getElementsByTagName("script")[0];
        others.parentNode.insertBefore(script, others);
        var list = loading[mode] = [cont];
        var count = 0, poll = setInterval(function () {
            if (++count > 100)return clearInterval(poll);
            if (CodeMirror.modes.hasOwnProperty(mode)) {
                clearInterval(poll);
                loading[mode] = null;
                ensureDeps(mode, function () {
                    for (var i = 0; i < list.length; ++i)list[i]()
                })
            }
        }, 200)
    };
    CodeMirror.autoLoadMode = function (instance, mode) {
        if (!CodeMirror.modes.hasOwnProperty(mode)) {
            CodeMirror.requireMode(mode, function () {
                instance.setOption("mode", instance.getOption("mode"))
            })
        }
    }
})();
