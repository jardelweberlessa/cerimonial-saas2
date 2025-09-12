/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/Nav.js":
/*!***************************!*\
  !*** ./components/Nav.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Nav)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/supabaseClient */ \"./lib/supabaseClient.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nfunction Nav() {\n    const [session, setSession] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.getSession().then(({ data })=>setSession(data.session || null));\n        const { data: sub } = _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.onAuthStateChange((_event, sess)=>setSession(sess));\n        return ()=>sub.subscription.unsubscribe();\n    }, []);\n    const logout = async ()=>{\n        await _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_2__.supabase.auth.signOut();\n        window.location.href = \"/login\";\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n        className: \"bg-white/80 backdrop-blur border-b sticky top-0 z-20\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"container py-3 flex items-center gap-4\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {\n                    className: \"font-semibold\",\n                    href: \"/\",\n                    children: \"Cerimonial SaaS\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\components\\\\Nav.js\",\n                    lineNumber: 22,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                    className: \"ml-auto flex gap-3\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {\n                            className: \"text-sm\",\n                            href: \"/app\",\n                            children: \"App\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\components\\\\Nav.js\",\n                            lineNumber: 24,\n                            columnNumber: 11\n                        }, this),\n                        session ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: logout,\n                            className: \"text-sm text-red-600\",\n                            children: \"Sair\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\components\\\\Nav.js\",\n                            lineNumber: 26,\n                            columnNumber: 13\n                        }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {\n                            className: \"text-sm\",\n                            href: \"/login\",\n                            children: \"Entrar\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\components\\\\Nav.js\",\n                            lineNumber: 28,\n                            columnNumber: 13\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\components\\\\Nav.js\",\n                    lineNumber: 23,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\components\\\\Nav.js\",\n            lineNumber: 21,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\components\\\\Nav.js\",\n        lineNumber: 20,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL05hdi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBNkI7QUFDb0I7QUFDTDtBQUU3QixTQUFTSTtJQUN0QixNQUFNLENBQUNDLFNBQVNDLFdBQVcsR0FBR0gsK0NBQVFBLENBQUM7SUFFdkNELGdEQUFTQSxDQUFDO1FBQ1JELHlEQUFRQSxDQUFDTSxJQUFJLENBQUNDLFVBQVUsR0FBR0MsSUFBSSxDQUFDLENBQUMsRUFBRUMsSUFBSSxFQUFFLEdBQUtKLFdBQVdJLEtBQUtMLE9BQU8sSUFBSTtRQUN6RSxNQUFNLEVBQUVLLE1BQU1DLEdBQUcsRUFBRSxHQUFHVix5REFBUUEsQ0FBQ00sSUFBSSxDQUFDSyxpQkFBaUIsQ0FBQyxDQUFDQyxRQUFRQyxPQUFTUixXQUFXUTtRQUNuRixPQUFPLElBQU1ILElBQUlJLFlBQVksQ0FBQ0MsV0FBVztJQUMzQyxHQUFHLEVBQUU7SUFFTCxNQUFNQyxTQUFTO1FBQ2IsTUFBTWhCLHlEQUFRQSxDQUFDTSxJQUFJLENBQUNXLE9BQU87UUFDM0JDLE9BQU9DLFFBQVEsQ0FBQ0MsSUFBSSxHQUFHO0lBQ3pCO0lBRUEscUJBQ0UsOERBQUNDO1FBQU9DLFdBQVU7a0JBQ2hCLDRFQUFDQztZQUFJRCxXQUFVOzs4QkFDYiw4REFBQ3ZCLGtEQUFJQTtvQkFBQ3VCLFdBQVU7b0JBQWdCRixNQUFLOzhCQUFJOzs7Ozs7OEJBQ3pDLDhEQUFDSTtvQkFBSUYsV0FBVTs7c0NBQ2IsOERBQUN2QixrREFBSUE7NEJBQUN1QixXQUFVOzRCQUFVRixNQUFLO3NDQUFPOzs7Ozs7d0JBQ3JDaEIsd0JBQ0MsOERBQUNxQjs0QkFBT0MsU0FBU1Y7NEJBQVFNLFdBQVU7c0NBQXVCOzs7OztpREFFMUQsOERBQUN2QixrREFBSUE7NEJBQUN1QixXQUFVOzRCQUFVRixNQUFLO3NDQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1wRCIsInNvdXJjZXMiOlsid2VicGFjazovL2Nlcmltb25pYWwtc2Fhcy8uL2NvbXBvbmVudHMvTmF2LmpzPzg2NGEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcclxuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tICcuLi9saWIvc3VwYWJhc2VDbGllbnQnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTmF2KCkge1xyXG4gIGNvbnN0IFtzZXNzaW9uLCBzZXRTZXNzaW9uXSA9IHVzZVN0YXRlKG51bGwpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc3VwYWJhc2UuYXV0aC5nZXRTZXNzaW9uKCkudGhlbigoeyBkYXRhIH0pID0+IHNldFNlc3Npb24oZGF0YS5zZXNzaW9uIHx8IG51bGwpKTtcclxuICAgIGNvbnN0IHsgZGF0YTogc3ViIH0gPSBzdXBhYmFzZS5hdXRoLm9uQXV0aFN0YXRlQ2hhbmdlKChfZXZlbnQsIHNlc3MpID0+IHNldFNlc3Npb24oc2VzcykpO1xyXG4gICAgcmV0dXJuICgpID0+IHN1Yi5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IGxvZ291dCA9IGFzeW5jICgpID0+IHtcclxuICAgIGF3YWl0IHN1cGFiYXNlLmF1dGguc2lnbk91dCgpO1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2xvZ2luJztcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGhlYWRlciBjbGFzc05hbWU9XCJiZy13aGl0ZS84MCBiYWNrZHJvcC1ibHVyIGJvcmRlci1iIHN0aWNreSB0b3AtMCB6LTIwXCI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyIHB5LTMgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cclxuICAgICAgICA8TGluayBjbGFzc05hbWU9XCJmb250LXNlbWlib2xkXCIgaHJlZj1cIi9cIj5DZXJpbW9uaWFsIFNhYVM8L0xpbms+XHJcbiAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJtbC1hdXRvIGZsZXggZ2FwLTNcIj5cclxuICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cInRleHQtc21cIiBocmVmPVwiL2FwcFwiPkFwcDwvTGluaz5cclxuICAgICAgICAgIHtzZXNzaW9uID8gKFxyXG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2xvZ291dH0gY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXJlZC02MDBcIj5TYWlyPC9idXR0b24+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJ0ZXh0LXNtXCIgaHJlZj1cIi9sb2dpblwiPkVudHJhcjwvTGluaz5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9uYXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9oZWFkZXI+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiTGluayIsInN1cGFiYXNlIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJOYXYiLCJzZXNzaW9uIiwic2V0U2Vzc2lvbiIsImF1dGgiLCJnZXRTZXNzaW9uIiwidGhlbiIsImRhdGEiLCJzdWIiLCJvbkF1dGhTdGF0ZUNoYW5nZSIsIl9ldmVudCIsInNlc3MiLCJzdWJzY3JpcHRpb24iLCJ1bnN1YnNjcmliZSIsImxvZ291dCIsInNpZ25PdXQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJoZWFkZXIiLCJjbGFzc05hbWUiLCJkaXYiLCJuYXYiLCJidXR0b24iLCJvbkNsaWNrIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/Nav.js\n");

/***/ }),

/***/ "./lib/supabaseClient.js":
/*!*******************************!*\
  !*** ./lib/supabaseClient.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);\n\nconst supabaseUrl = \"https://tlttkhlezdgqqueebftt.supabase.co\";\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsdHRraGxlemRncXF1ZWViZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NjIyNTAsImV4cCI6MjA3MjQzODI1MH0.QcBOLOdLMDqa_J6OcPtXX2Eo4T3MeGewfUillO2KfVM\";\n// Se as variáveis não estiverem definidas ainda, evita crash em build\nif (!supabaseUrl || !supabaseAnonKey) {\n    console.warn(\"⚠️ Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local antes de usar o login.\");\n}\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl || \"http://localhost\", supabaseAnonKey || \"anon_key_placeholder\");\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvc3VwYWJhc2VDbGllbnQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXFEO0FBRXJELE1BQU1DLGNBQWNDLDBDQUFvQztBQUN4RCxNQUFNRyxrQkFBa0JILGtOQUF5QztBQUVqRSxzRUFBc0U7QUFDdEUsSUFBSSxDQUFDRCxlQUFlLENBQUNJLGlCQUFpQjtJQUNwQ0UsUUFBUUMsSUFBSSxDQUFDO0FBQ2Y7QUFFTyxNQUFNQyxXQUFXVCxtRUFBWUEsQ0FBQ0MsZUFBZSxvQkFBb0JJLG1CQUFtQix3QkFBd0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZXJpbW9uaWFsLXNhYXMvLi9saWIvc3VwYWJhc2VDbGllbnQuanM/NWYwZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xyXG5cclxuY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkw7XHJcbmNvbnN0IHN1cGFiYXNlQW5vbktleSA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZO1xyXG5cclxuLy8gU2UgYXMgdmFyacOhdmVpcyBuw6NvIGVzdGl2ZXJlbSBkZWZpbmlkYXMgYWluZGEsIGV2aXRhIGNyYXNoIGVtIGJ1aWxkXHJcbmlmICghc3VwYWJhc2VVcmwgfHwgIXN1cGFiYXNlQW5vbktleSkge1xyXG4gIGNvbnNvbGUud2Fybign4pqg77iPIERlZmluYSBORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwgZSBORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSBubyAuZW52LmxvY2FsIGFudGVzIGRlIHVzYXIgbyBsb2dpbi4nKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsIHx8ICdodHRwOi8vbG9jYWxob3N0Jywgc3VwYWJhc2VBbm9uS2V5IHx8ICdhbm9uX2tleV9wbGFjZWhvbGRlcicpO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50Iiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VBbm9uS2V5IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkiLCJjb25zb2xlIiwid2FybiIsInN1cGFiYXNlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./lib/supabaseClient.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_Nav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Nav */ \"./components/Nav.js\");\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"min-h-screen flex flex-col\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Nav__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\pages\\\\_app.js\",\n                lineNumber: 7,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: \"flex-1 container py-6\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\pages\\\\_app.js\",\n                    lineNumber: 9,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\pages\\\\_app.js\",\n                lineNumber: 8,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"footer\", {\n                className: \"py-6 text-center text-xs text-gray-500\",\n                children: [\n                    \"\\xa9 \",\n                    new Date().getFullYear(),\n                    \" Cerimonial SaaS (MVP)\"\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\pages\\\\_app.js\",\n                lineNumber: 11,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Info\\\\Desktop\\\\cerimonial-saas2\\\\pages\\\\_app.js\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBOEI7QUFDSztBQUVwQixTQUFTQyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ3BELHFCQUNFLDhEQUFDQztRQUFJQyxXQUFVOzswQkFDYiw4REFBQ0wsdURBQUdBOzs7OzswQkFDSiw4REFBQ007Z0JBQUtELFdBQVU7MEJBQ2QsNEVBQUNIO29CQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7OzBCQUUxQiw4REFBQ0k7Z0JBQU9GLFdBQVU7O29CQUF5QztvQkFBRyxJQUFJRyxPQUFPQyxXQUFXO29CQUFHOzs7Ozs7Ozs7Ozs7O0FBRzdGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2VyaW1vbmlhbC1zYWFzLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xyXG5pbXBvcnQgTmF2IGZyb20gJy4uL2NvbXBvbmVudHMvTmF2J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGZsZXggZmxleC1jb2xcIj5cclxuICAgICAgPE5hdiAvPlxyXG4gICAgICA8bWFpbiBjbGFzc05hbWU9XCJmbGV4LTEgY29udGFpbmVyIHB5LTZcIj5cclxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICAgIDwvbWFpbj5cclxuICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJweS02IHRleHQtY2VudGVyIHRleHQteHMgdGV4dC1ncmF5LTUwMFwiPsKpIHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9IENlcmltb25pYWwgU2FhUyAoTVZQKTwvZm9vdGVyPlxyXG4gICAgPC9kaXY+XHJcbiAgKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJOYXYiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImRpdiIsImNsYXNzTmFtZSIsIm1haW4iLCJmb290ZXIiLCJEYXRlIiwiZ2V0RnVsbFllYXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();