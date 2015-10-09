/*!
 * jQuery Upload File Plugin
 * version: 4.0.8
 * @requires jQuery v1.5 or later & form plugin
 * Copyright (c) 2013 Ravishanker Kusuma
 * http://hayageek.com/
 */
!function (e) {
    void 0 == e.fn.ajaxForm && e.getScript(("https:" == document.location.protocol ? "https://" : "http://") + "malsup.github.io/jquery.form.js");
    var a = {};
    a.fileapi = void 0 !== e("<input type='file'/>").get(0).files, a.formdata = void 0 !== window.FormData, e.fn.uploadFile = function (t) {
        function r() {
            S || (S = !0, function e() {
                if (w.sequential || (w.sequentialCount = 99999), 0 == x.length && 0 == D.length)w.afterUploadAll && w.afterUploadAll(C), S = !1; else {
                    if (D.length < w.sequentialCount) {
                        var a = x.shift();
                        void 0 != a && (D.push(a), a.submit())
                    }
                    window.setTimeout(e, 100)
                }
            }())
        }

        function o(a, t, r) {
            r.on("dragenter", function (a) {
                a.stopPropagation(), a.preventDefault(), e(this).addClass(t.dragDropHoverClass)
            }), r.on("dragover", function (a) {
                a.stopPropagation(), a.preventDefault();
                var r = e(this);
                r.hasClass(t.dragDropContainerClass) && !r.hasClass(t.dragDropHoverClass) && r.addClass(t.dragDropHoverClass)
            }), r.on("drop", function (r) {
                r.preventDefault(), e(this).removeClass(t.dragDropHoverClass), a.errorLog.html("");
                var o = r.originalEvent.dataTransfer.files;
                return !t.multiple && o.length > 1 ? void(t.showError && e("<div class='" + t.errorClass + "'>" + t.multiDragErrorStr + "</div>").appendTo(a.errorLog)) : void(0 != t.onSelect(o) && l(t, a, o))
            }), r.on("dragleave", function () {
                e(this).removeClass(t.dragDropHoverClass)
            }), e(document).on("dragenter", function (e) {
                e.stopPropagation(), e.preventDefault()
            }), e(document).on("dragover", function (a) {
                a.stopPropagation(), a.preventDefault();
                var r = e(this);
                r.hasClass(t.dragDropContainerClass) || r.removeClass(t.dragDropHoverClass)
            }), e(document).on("drop", function (a) {
                a.stopPropagation(), a.preventDefault(), e(this).removeClass(t.dragDropHoverClass)
            })
        }

        function s(e) {
            var a = "", t = e / 1024;
            if (parseInt(t) > 1024) {
                var r = t / 1024;
                a = r.toFixed(2) + " MB"
            } else a = t.toFixed(2) + " KB";
            return a
        }

        function i(a) {
            var t = [];
            t = "string" == jQuery.type(a) ? a.split("&") : e.param(a).split("&");
            var r, o, s = t.length, i = [];
            for (r = 0; s > r; r++)t[r] = t[r].replace(/\+/g, " "), o = t[r].split("="), i.push([decodeURIComponent(o[0]), decodeURIComponent(o[1])]);
            return i
        }

        function l(a, t, r) {
            for (var o = 0; o < r.length; o++)if (n(t, a, r[o].name))if (a.allowDuplicates || !d(t, r[o].name))if (-1 != a.maxFileSize && r[o].size > a.maxFileSize)a.showError && e("<div class='" + a.errorClass + "'><b>" + r[o].name + "</b> " + a.sizeErrorStr + s(a.maxFileSize) + "</div>").appendTo(t.errorLog); else if (-1 != a.maxFileCount && t.selectedFiles >= a.maxFileCount)a.showError && e("<div class='" + a.errorClass + "'><b>" + r[o].name + "</b> " + a.maxFileCountErrorStr + a.maxFileCount + "</div>").appendTo(t.errorLog); else {
                t.selectedFiles++, t.existingFileNames.push(r[o].name);
                var l = a, p = new FormData, u = a.fileName.replace("[]", "");
                p.append(u, r[o]);
                var c = a.formData;
                if (c)for (var h = i(c), f = 0; f < h.length; f++)h[f] && p.append(h[f][0], h[f][1]);
                l.fileData = p;
                var w = new m(t, a), g = "";
                g = a.showFileCounter ? t.fileCounter + a.fileCounterStyle + r[o].name : r[o].name, a.showFileSize && (g += " (" + s(r[o].size) + ")"), w.filename.html(g);
                var C = e("<form style='display:block; position:absolute;left: 150px;' class='" + t.formGroup + "' method='" + a.method + "' action='" + a.url + "' enctype='" + a.enctype + "'></form>");
                C.appendTo("body");
                var b = [];
                b.push(r[o].name), v(C, l, w, b, t, r[o]), t.fileCounter++
            } else a.showError && e("<div class='" + a.errorClass + "'><b>" + r[o].name + "</b> " + a.duplicateErrorStr + "</div>").appendTo(t.errorLog); else a.showError && e("<div class='" + a.errorClass + "'><b>" + r[o].name + "</b> " + a.extErrorStr + a.allowedTypes + "</div>").appendTo(t.errorLog)
        }

        function n(e, a, t) {
            var r = a.allowedTypes.toLowerCase().split(/[\s,]+/g), o = t.split(".").pop().toLowerCase();
            return "*" != a.allowedTypes && jQuery.inArray(o, r) < 0 ? !1 : !0
        }

        function d(e, a) {
            var t = !1;
            if (e.existingFileNames.length)for (var r = 0; r < e.existingFileNames.length; r++)(e.existingFileNames[r] == a || w.duplicateStrict && e.existingFileNames[r].toLowerCase() == a.toLowerCase()) && (t = !0);
            return t
        }

        function p(e, a) {
            if (e.existingFileNames.length)for (var t = 0; t < a.length; t++) {
                var r = e.existingFileNames.indexOf(a[t]);
                -1 != r && e.existingFileNames.splice(r, 1)
            }
        }

        function u(e, a) {
            if (e) {
                a.show();
                var t = new FileReader;
                t.onload = function (e) {
                    a.attr("src", e.target.result)
                }, t.readAsDataURL(e)
            }
        }

        function c(a, t) {
            if (a.showFileCounter) {
                var r = e(t.container).find(".ajax-file-upload-filename").length;
                t.fileCounter = r + 1, e(t.container).find(".ajax-file-upload-filename").each(function () {
                    var t = e(this).html().split(a.fileCounterStyle), o = (parseInt(t[0]) - 1, r + a.fileCounterStyle + t[1]);
                    e(this).html(o), r--
                })
            }
        }

        function h(t, r, o, s) {
            var i = "ajax-upload-id-" + (new Date).getTime(), d = e("<form method='" + o.method + "' action='" + o.url + "' enctype='" + o.enctype + "'></form>"), p = "<input type='file' id='" + i + "' name='" + o.fileName + "' accept='" + o.acceptFiles + "'/>";
            o.multiple && (o.fileName.indexOf("[]") != o.fileName.length - 2 && (o.fileName += "[]"), p = "<input type='file' id='" + i + "' name='" + o.fileName + "' accept='" + o.acceptFiles + "' multiple/>");
            var u = e(p).appendTo(d);
            u.change(function () {
                t.errorLog.html("");
                var i = (o.allowedTypes.toLowerCase().split(","), []);
                if (this.files) {
                    for (g = 0; g < this.files.length; g++)i.push(this.files[g].name);
                    if (0 == o.onSelect(this.files))return
                } else {
                    var p = e(this).val(), u = [];
                    if (i.push(p), !n(t, o, p))return void(o.showError && e("<div class='" + o.errorClass + "'><b>" + p + "</b> " + o.extErrorStr + o.allowedTypes + "</div>").appendTo(t.errorLog));
                    if (u.push({name: p, size: "NA"}), 0 == o.onSelect(u))return
                }
                if (c(o, t), s.unbind("click"), d.hide(), h(t, r, o, s), d.addClass(r), o.serialize && a.fileapi && a.formdata) {
                    d.removeClass(r);
                    var f = this.files;
                    d.remove(), l(o, t, f)
                } else {
                    for (var w = "", g = 0; g < i.length; g++)w += o.showFileCounter ? t.fileCounter + o.fileCounterStyle + i[g] + "<br>" : i[g] + "<br>", t.fileCounter++;
                    if (-1 != o.maxFileCount && t.selectedFiles + i.length > o.maxFileCount)return void(o.showError && e("<div class='" + o.errorClass + "'><b>" + w + "</b> " + o.maxFileCountErrorStr + o.maxFileCount + "</div>").appendTo(t.errorLog));
                    t.selectedFiles += i.length;
                    var C = new m(t, o);
                    C.filename.html(w), v(d, o, C, i, t, null)
                }
            }), o.nestedForms ? (d.css({margin: 0, padding: 0}), s.css({
                position: "relative",
                overflow: "hidden",
                cursor: "default"
            }), u.css({
                position: "absolute",
                cursor: "pointer",
                top: "0px",
                width: "100%",
                height: "100%",
                left: "0px",
                "z-index": "100",
                opacity: "0.0",
                filter: "alpha(opacity=0)",
                "-ms-filter": "alpha(opacity=0)",
                "-khtml-opacity": "0.0",
                "-moz-opacity": "0.0"
            }), d.appendTo(s)) : (d.appendTo(e("body")), d.css({
                margin: 0,
                padding: 0,
                display: "block",
                position: "absolute",
                left: "-250px"
            }), -1 != navigator.appVersion.indexOf("MSIE ") ? s.attr("for", i) : s.click(function () {
                u.click()
            }))
        }

        function f(a, t) {
            jQuery("#loading-mask").css({"width": jQuery(window).width() + "px", "height": jQuery(window).height() + "px", "top": "0px", "z-index": "9999"});
            //of browser scroll
            jQuery("body").css({ overflow: 'hidden' });
            jQuery("#loading-mask").show();
            return this.statusbar = e("<div class='ajax-file-upload-statusbar'></div>").width(t.statusBarWidth), this.preview = e("<img class='ajax-file-upload-preview' />").width(t.previewWidth).height(t.previewHeight).appendTo(this.statusbar).hide(), this.filename = e("<div class='ajax-file-upload-filename'></div>").appendTo(this.statusbar), this.progressDiv = e("<div class='ajax-file-upload-progress'>").appendTo(this.statusbar).hide(), this.progressbar = e("<div class='ajax-file-upload-bar'></div>").appendTo(this.progressDiv), this.abort = e("<div>" + t.abortStr + "</div>").appendTo(this.statusbar).hide(), this.cancel = e("<div>" + t.cancelStr + "</div>").appendTo(this.statusbar).hide(), this.done = e("<div>" + t.doneStr + "</div>").appendTo(this.statusbar).hide(), this.download = e("<div>" + t.downloadStr + "</div>").appendTo(this.statusbar).hide(), this.del = e("<div>" + t.deletelStr + "</div>").appendTo(this.statusbar).hide(), this.abort.addClass("ajax-file-upload-red"), this.done.addClass("ajax-file-upload-green"), this.download.addClass("ajax-file-upload-green"), this.cancel.addClass("ajax-file-upload-red"), this.del.addClass("ajax-file-upload-red"), this
        }

        function m(a, t) {
            var r = null;
            return r = t.customProgressBar ? new t.customProgressBar(a, t) : new f(a, t), r.abort.addClass(a.formGroup), r.abort.addClass(t.abortButtonClass), r.cancel.addClass(a.formGroup), r.cancel.addClass(t.cancelButtonClass), t.extraHTML && (r.extraHTML = e("<div class='extrahtml'>" + t.extraHTML() + "</div>").insertAfter(r.filename)), "bottom" == t.uploadQueuOrder ? e(a.container).append(r.statusbar) : e(a.container).prepend(r.statusbar), r
        }

        function v(t, o, s, l, n, d) {
            var h = {
                cache: !1,
                contentType: !1,
                processData: !1,
                forceSync: !1,
                type: o.method,
                data: o.formData,
                formData: o.fileData,
                dataType: o.returnType,
                beforeSubmit: function (a, r, d) {
                    if (0 != o.onSubmit.call(this, l)) {
                        if (o.dynamicFormData) {
                            var u = i(o.dynamicFormData());
                            if (u)for (var h = 0; h < u.length; h++)u[h] && (void 0 != o.fileData ? d.formData.append(u[h][0], u[h][1]) : d.data[u[h][0]] = u[h][1])
                        }
                        return o.extraHTML && e(s.extraHTML).find("input,select,textarea").each(function () {
                            void 0 != o.fileData ? d.formData.append(e(this).attr("name"), e(this).val()) : d.data[e(this).attr("name")] = e(this).val()
                        }), !0
                    }
                    return s.statusbar.append("<div class='" + o.errorClass + "'>" + o.uploadErrorStr + "</div>"), s.cancel.show(), t.remove(), s.cancel.click(function () {
                        x.splice(x.indexOf(t), 1), p(n, l), s.statusbar.remove(), o.onCancel.call(n, l, s), n.selectedFiles -= l.length, c(o, n)
                    }), !1
                },
                beforeSend: function (e) {
                    s.progressDiv.show(), s.cancel.hide(), s.done.hide(), o.showAbort && (s.abort.show(), s.abort.click(function () {
                        p(n, l), e.abort(), n.selectedFiles -= l.length, o.onAbort.call(n, l, s)
                    })), s.progressbar.width(a.formdata ? "1%" : "5%")
                },
                uploadProgress: function (e, a, t, r) {
                    r > 98 && (r = 98);
                    var i = r + "%";
                    r > 1 && s.progressbar.width(i), o.showProgress && (s.progressbar.html(i), s.progressbar.css("text-align", "center"))
                },
                success: function (a, r, i) {
                    if (s.cancel.remove(), D.pop(), "json" == o.returnType && "object" == e.type(a) && a.hasOwnProperty(o.customErrorKeyStr)) {
                        s.abort.hide();
                        var d = a[o.customErrorKeyStr];
                        return o.onError.call(this, l, 200, d, s), o.showStatusAfterError ? (s.progressDiv.hide(), s.statusbar.append("<span class='" + o.errorClass + "'>ERROR: " + d + "</span>")) : (s.statusbar.hide(), s.statusbar.remove()), n.selectedFiles -= l.length, void t.remove()
                    }
                    n.responses.push(a), s.progressbar.width("100%"), o.showProgress && (s.progressbar.html("100%"), s.progressbar.css("text-align", "center")), s.abort.hide(), o.onSuccess.call(this, l, a, i, s), o.showStatusAfterSuccess ? (o.showDone ? (s.done.show(), s.done.click(function () {
                        s.statusbar.hide("slow"), s.statusbar.remove()
                    })) : s.done.hide(), o.showDelete ? (s.del.show(), s.del.click(function () {
                        s.statusbar.hide().remove(), o.deleteCallback && o.deleteCallback.call(this, a, s), n.selectedFiles -= l.length, c(o, n)
                    })) : s.del.hide()) : (s.statusbar.hide("slow"), s.statusbar.remove()), o.showDownload && (s.download.show(), s.download.click(function () {
                        o.downloadCallback && o.downloadCallback(a)
                    })), t.remove()
                },
                error: function (e, a, r) {
                    s.cancel.remove(), D.pop(), s.abort.hide(), "abort" == e.statusText ? (s.statusbar.hide("slow").remove(), c(o, n)) : (o.onError.call(this, l, a, r, s), o.showStatusAfterError ? (s.progressDiv.hide(), s.statusbar.append("<span class='" + o.errorClass + "'>ERROR: " + r + "</span>")) : (s.statusbar.hide(), s.statusbar.remove()), n.selectedFiles -= l.length), t.remove()
                }
            };
            o.showPreview && null != d && "image" == d.type.toLowerCase().split("/").shift() && u(d, s.preview), o.autoSubmit ? (t.ajaxForm(h), x.push(t), r()) : (o.showCancel && (s.cancel.show(), s.cancel.click(function () {
                x.splice(x.indexOf(t), 1), p(n, l), t.remove(), s.statusbar.remove(), o.onCancel.call(n, l, s), n.selectedFiles -= l.length, c(o, n)
            })), t.ajaxForm(h))
        }

        var w = e.extend({
            url: "",
            method: "POST",
            enctype: "multipart/form-data",
            returnType: null,
            allowDuplicates: !0,
            duplicateStrict: !1,
            allowedTypes: "*",
            acceptFiles: "*",
            fileName: "file",
            formData: !1,
            dynamicFormData: !1,
            maxFileSize: -1,
            maxFileCount: -1,
            multiple: !0,
            dragDrop: !0,
            autoSubmit: !0,
            showCancel: !0,
            showAbort: !0,
            showDone: !1,
            showDelete: !1,
            showError: !0,
            showStatusAfterSuccess: !0,
            showStatusAfterError: !0,
            showFileCounter: !0,
            fileCounterStyle: "). ",
            showFileSize: !0,
            showProgress: !1,
            nestedForms: !0,
            showDownload: !1,
            onLoad: function () {
            },
            onSelect: function () {
                return !0
            },
            onSubmit: function () {
            },
            onSuccess: function () {
            },
            onError: function () {
            },
            onCancel: function () {
            },
            onAbort: function () {
            },
            downloadCallback: !1,
            deleteCallback: !1,
            afterUploadAll: !1,
            serialize: !0,
            sequential: !1,
            sequentialCount: 2,
            customProgressBar: !1,
            abortButtonClass: "ajax-file-upload-abort",
            cancelButtonClass: "ajax-file-upload-cancel",
            dragDropContainerClass: "ajax-upload-dragdrop",
            dragDropHoverClass: "state-hover",
            errorClass: "ajax-file-upload-error",
            uploadButtonClass: "ajax-file-upload",
            dragDropStr: "<span><b>Drag & Drop Files</b></span>",
            uploadStr: "Upload",
            abortStr: "Abort",
            cancelStr: "Cancel",
            deletelStr: "Delete",
            doneStr: "Done",
            multiDragErrorStr: "Multiple File Drag & Drop is not allowed.",
            extErrorStr: "is not allowed. Allowed extensions: ",
            duplicateErrorStr: "is not allowed. File already exists.",
            sizeErrorStr: "is not allowed. Allowed Max size: ",
            uploadErrorStr: "Upload is not allowed",
            maxFileCountErrorStr: " is not allowed. Maximum allowed files are:",
            downloadStr: "Download",
            customErrorKeyStr: "jquery-upload-file-error",
            showQueueDiv: !1,
            statusBarWidth: 400,
            dragdropWidth: 400,
            showPreview: !1,
            previewHeight: "auto",
            previewWidth: "100%",
            extraHTML: !1,
            uploadQueuOrder: "top"
        }, t);
        this.fileCounter = 1, this.selectedFiles = 0;
        var g = "ajax-file-upload-" + (new Date).getTime();
        this.formGroup = g, this.errorLog = e("<div></div>"), this.responses = [], this.existingFileNames = [], a.formdata || (w.dragDrop = !1), a.formdata || (w.multiple = !1), e(this).html("");
        var C = this, b = e("<div>" + w.uploadStr + "</div>");
        e(b).addClass(w.uploadButtonClass), function F() {
            if (e.fn.ajaxForm) {
                if (w.dragDrop) {
                    var a = e('<div class="' + w.dragDropContainerClass + '" style="vertical-align:top;"></div>').width(w.dragdropWidth);
                    e(C).append(a), e(a).append(b), e(a).append(e(w.dragDropStr)), o(C, w, a)
                } else e(C).append(b);
                e(C).append(C.errorLog), C.container = w.showQueueDiv ? e("#" + w.showQueueDiv) : e("<div class='ajax-file-upload-container'></div>").insertAfter(e(C)), w.onLoad.call(this, C), h(C, g, w, b)
            } else window.setTimeout(F, 10)
        }(), this.startUpload = function () {
            e("form").each(function () {
                e(this).hasClass(C.formGroup) && x.push(e(this))
            }), x.length >= 1 && r()
        }, this.getFileCount = function () {
            return C.selectedFiles
        }, this.stopUpload = function () {
            e("." + w.abortButtonClass).each(function () {
                e(this).hasClass(C.formGroup) && e(this).click()
            }), e("." + w.cancelButtonClass).each(function () {
                e(this).hasClass(C.formGroup) && e(this).click()
            })
        }, this.cancelAll = function () {
            e("." + w.cancelButtonClass).each(function () {
                e(this).hasClass(C.formGroup) && e(this).click()
            })
        }, this.update = function (a) {
            w = e.extend(w, a)
        }, this.reset = function (e) {
            C.fileCounter = 1, C.selectedFiles = 0, C.errorLog.html(""), 0 != e && C.container.html("")
        }, this.remove = function () {
            C.container.html(""), e(C).remove()
        }, this.createProgress = function (e, a, t) {
            var r = new m(this, w);
            r.progressDiv.show(), r.progressbar.width("100%");
            var o = "";
            o = w.showFileCounter ? C.fileCounter + w.fileCounterStyle + e : e, w.showFileSize && (o += " (" + s(t) + ")"), r.filename.html(o), C.fileCounter++, C.selectedFiles++, w.showPreview && (r.preview.attr("src", a), r.preview.show()), w.showDownload && (r.download.show(), r.download.click(function () {
                w.downloadCallback && w.downloadCallback.call(C, [e])
            })), w.showDelete && (r.del.show(), r.del.click(function () {
                r.statusbar.hide().remove();
                var a = [e];
                w.deleteCallback && w.deleteCallback.call(this, a, r), C.selectedFiles -= 1, c(w, C)
            }))
        }, this.getResponses = function () {
            return this.responses
        };
        var x = [], D = [], S = !1;
        return this
    }
}(jQuery);