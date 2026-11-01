import type { CSSProperties } from "react";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import capturedCSS from "../styles/site.css?raw";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Parking Finder App Prototype – Figma Make" }] }),
  staticData: { importedDocument: { html: { "className": "fullscreen_view--fullscreenHtml--eYPWu", "lang": "en", "style": { "--left-panel-width": "368px", "--right-panel-width": "0px", "--canvas-color": "rgba(245, 245, 245, 1)" } as import("react").CSSProperties }, body: { "className": "fullscreen_view--fullscreenBody--KHlOf", "data-editor-theme": "seascape", "data-fpl-version": "ui3", "data-preferred-theme": "light", "style": { colorScheme: "light" } as import("react").CSSProperties } } },
  component: Index,
});

function Index() {
  const [openMenu0, setOpenMenu0] = useState(null as string | null);
  return (
    <>
      <style>{capturedCSS}</style>
      <div id="react-page">
        <div>
          <div className="in_app_page--app--UBZ1M in_app_page--appFont--PJJ3L">
            <div className="in_app_page--content--ozQrr">
              <div>
                <div style={{ position: "fixed", top: "0px", left: "0px", width: "100vw", height: "100vh", overflow: "visible", pointerEvents: "none", zIndex: "1" }}>
                  <div style={{ position: "fixed", opacity: "1", pointerEvents: "none", zIndex: "0", top: "81.5781px", left: "780.047px", width: "402px", height: "874px", transform: "matrix(0.857898, 0, 0, 0.857927, 0, 0)", transformOrigin: "left top", overflow: "visible" } as CSSProperties} data-site-import-responsive="8">
                    <div className="x10a8y8t x1ja2u2z x10l6tqk xb3r6kr x1qgsegg xaatb59 xfu5tiv x42x0ya xi9hqdr" style={{ borderRadius: "6%" }}>
                      <div className="x78zum5 xdt5ytf x5yr21d xh8yej3 x1n2onr6">
                        <div className="x78zum5 xdt5ytf x5yr21d xh8yej3 x1n2onr6 x4qgb6o">
                          <div className="x1iyjqo2 x2lwn1j xh8yej3 x1n2onr6">
                            <div className="x10l6tqk x13vifvy x3m8u43 x1ey2m1c xu96u03 x9f619" style={{ display: "flex", transition: "opacity 0.2s ease-in-out, filter 0.2s ease-in-out", filter: "none", pointerEvents: "none" } as CSSProperties}>
                              <div className="x1n2onr6 xh8yej3 x5yr21d">
                                <div className="x10l6tqk x10a8y8t xh8yej3 x5yr21d" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <img className="x10l6tqk x47corl x8jl10z xr3buco" style={{ width: "108.624%", height: "103.356%", left: "-4.31177%", top: "-1.67811%" }} alt="iPhone 17 (Lavender)" src="/site-assets/b6851c7e34cf95cc.png" />
                  </div>
                </div>
                <div style={{ position: "fixed", opacity: "1", pointerEvents: "none", zIndex: "2", top: "49px", left: "369px", width: "1167px", height: "815px", transform: "matrix(1, 0, 0, 1, 0, 0)", transformOrigin: "left top", overflow: "visible" } as CSSProperties} data-site-import-responsive="18">
                  <div style={{ inset: "0px", pointerEvents: "none", position: "absolute", zIndex: "20" }} />
                  <div style={{ inset: "0px", pointerEvents: "none", position: "absolute", zIndex: "30" }} />
                </div>
                <div className="fullscreen_view--flexContainer--hTDxU">
                  <div style={{ flex: "1 1 auto", minHeight: "0px" }}>
                    <div className="fullscreen_view--fullscreenViewportWrapper--TV7Gb" aria-hidden="true">
                      <div className="fullscreen_view--page--jfTvA" data-site-import-carousel-root="0">
                        <div style={{ display: "contents" }} data-editor-theme="design" data-preferred-theme="light">
                          <div role="status" aria-live="polite" aria-atomic="false" aria-relevant="additions text" />
                        </div>
                        <div className="viewport_overlay--overflowContainer--u8CFZ" style={{ top: "0px", left: "0px", height: "864px", width: "1536px" }} data-site-import-responsive="26">
                          <div className="viewport_overlay--innerContainer--wm1Q8" style={{ top: "0px", left: "0px" }}>
                            <div className="lov-shadow-0">
                              <div className="overlay" style={{ top: "402px", left: "768px", transform: "translate(-359px, -256px)" }} aria-hidden="true" data-ce-shadow-root="lov-shadow-0" />
                            </div>
                          </div>
                        </div>
                        <div style={{ position: "absolute" }}>
                          <div className="comments_view--viewContainer--XeAuT comments_view--_container--0M5kB">
                            <div className="comments_view--outerAnchorContainer--rIEo2 comments_view--_container--0M5kB" style={{ left: "0px", top: "0px", width: "1536px", height: "864px" }} data-site-import-responsive="32" />
                          </div>
                        </div>
                        <div className="viewport_overlay--overflowContainer--u8CFZ" style={{ top: "0px", left: "0px", height: "864px", width: "1536px" }} data-site-import-responsive="33">
                          <div className="viewport_overlay--innerContainer--wm1Q8" style={{ top: "0px", left: "0px" }}>
                            <div className="multiplayer_cursors--overlay--VAa-z" style={{ top: "432px", left: "768px", transform: "translate(-359px, -286px)", zIndex: "2" }} aria-hidden="true" data-site-import-responsive="35">
                              <div className="multiplayer_cursors--multiplayerCursorsContainer--7xsH0" />
                            </div>
                          </div>
                        </div>
                        <div className="multiplayer_cursors--root--bdWpK" style={{ left: "0px", top: "0px", width: "1536px", height: "864px", zIndex: "2" }} aria-hidden="true" data-site-import-responsive="37" />
                        <div />
                        <div className="x10l6tqk x13vifvy x1ey2m1c">
                          <div>
                            <div>
                              <div>
                                <div style={{ maxWidth: "500px", width: "368px" }} data-fullscreen-prevent-event-capture="true" id="left-panel-container">
                                  <div>
                                    <div data-fullscreen-prevent-event-capture="true">
                                      <div className="x78zum5 x1sk9g4k x6s0dn4 xh8yej3 xeuugli x156m2f4 x9f619">
                                        <button className="toolbar_view--menuButtonNew--7p2v4" data-fpl-component="primitive" aria-label="Main menu" type="button" tabIndex={0}>
                                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M7 7c0 1.043.533 1.963 1.341 2.5A3 3 0 0 0 7 12c0 1.043.533 1.963 1.341 2.5A3 3 0 1 0 13 17v-2.764A3 3 0 1 0 16.659 9.5 3 3 0 0 0 15 4h-5a3 3 0 0 0-3 3m8 2a2 2 0 1 0 0-4h-2v4zm-2 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0m-1 2h-2a2 2 0 1 1 0-4h2zm-2 1h2v2a2 2 0 1 1-2-2m2-6h-2a2 2 0 1 1 0-4h2z" clipRule="evenodd" />
                                          </svg>
                                        </button>
                                        <div className="xeuugli x78zum5 x6s0dn4 xrdokzc">
                                          <div>
                                            <div>
                                              <div>
                                                <span>
                                                  <button className="filename_view--title--EqcWj ellipsis--ellipsis--IdJAr" data-fpl-component="primitive" aria-label="Parking Finder App Prototype, file name" type="button" tabIndex={0}>Parking Finder App Prototype</button>
                                                  <label className="visually_hidden--visuallyHidden--jaEy6" htmlFor="filename">File name</label>
                                                  <input className="input--input--lrmjn filename_view--pageTitleInput--IuwUC ellipsis--ellipsis--IdJAr filename_view--hidden--Ssdwc" dir="auto" id="filename" maxLength={100} />
                                                </span>
                                              </div>
                                              <div>
                                                <div>
                                                  <div style={{ display: "contents" }} data-fpl-component="primitive" role="presentation">
                                                    <span className="xjmxbmz">
                                                      <button data-fpl-component="" aria-haspopup="menu" aria-expanded="false" id=":ra:" aria-label="Edit file menu" type="button" tabIndex={0}>
                                                        <span aria-hidden="true">
                                                          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                            <path fill="var(--fpl-icon-color, var(--color-icon))" d="M9.768 6.768a.5.5 0 0 1 .707.707l-2.12 2.121a.5.5 0 0 1-.708 0L5.525 7.475a.5.5 0 0 1 .708-.707l1.768 1.767z" />
                                                          </svg>
                                                        </span>
                                                      </button>
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="x78zum5 x6s0dn4 x2lah0s xrdokzc x8x9d4c">
                                          <div />
                                          <a className="x78zum5 x6s0dn4 xt0e3qv xt7dq6l x2lah0s x1sxf85j xb9akqj x1y3gkto" aria-label="AI, Learn more" data-fpl-component="primitive" href="https://help.figma.com/hc/articles/23870272542231" rel="noopener" target="_blank">
                                            <div className="x844mss xlk80a5 xmkeg23 x1y0btm7 x78zum5 xlup9mm xexx8yu x18d9i69 x6wrskw xmzs88n x1j6dyjg x6s0dn4 xl56j7k x1r0jzty x17zd0t2 x1sxf85j">AI</div>
                                          </a>
                                          <button className="xxk0z11 xeuugli x2aouup x7r0jtz xjbqb8w xy08kuh x1lnfiun x1q2v0gt x1k57tk5 x4xl6zf x1t137rt x9v5kkp x1uczgqu x1lvt9u7 x1wfwxd8 x13iak60" data-fpl-component="primitive" aria-expanded="false" type="button" tabIndex={0}>
                                            <div className="x78zum5 x6s0dn4 xeuugli x1w9l4j x12fneq8">
                                              <span className="xeuugli xb3r6kr xlyipyv xuxw1ft">Version 18</span>
                                              <svg className="x2lah0s" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                <path fill="var(--fpl-icon-color, var(--color-icon))" d="M9.768 6.768a.5.5 0 0 1 .707.707l-2.12 2.121a.5.5 0 0 1-.708 0L5.525 7.475a.5.5 0 0 1 .708-.707l1.768 1.767z" />
                                              </svg>
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="x16ye13r x82snj4" style={{ "--x-height": "calc(32px + var(--spacer-2) + var(--spacer-1))", "--x-minHeight": "calc(32px + var(--spacer-2) + var(--spacer-1))" } as CSSProperties} />
                                    <div className="xv9gime xdnwjd9 xh8yej3 x78zum5 xdt5ytf xozqiw3 xb3r6kr x1iyjqo2 xs83m0k x1t1x2f9 x4ax4og">
                                      <div className="x78zum5 xdt5ytf xh8yej3 x5yr21d x1gslohp x178xt8z x13fuv20 x1bljnoc">
                                        <div className="x1iyjqo2 xs83m0k x1t1x2f9">
                                          <div className="x1n2onr6 x78zum5 xdt5ytf xh8yej3 x5yr21d x9f619 x1lw1rap xnwblhb">
                                            <div className="x1n2onr6 xh8yej3 x5yr21d x78zum5 xdt5ytf">
                                              <div className="x1n2onr6 x78zum5 xdt5ytf x5yr21d xh8yej3" style={{ visibility: "hidden", "--chat-container-height": "637px" } as CSSProperties} data-fullscreen-prevent-event-capture="true" data-site-import-responsive="241">
                                                <div className="x78zum5 xdt5ytf x1iyjqo2 xs83m0k x1t1x2f9 xysyzu8 xej7fhh">
                                                  <div className="xuzfeq1 x8yk33q x1e00guj x18zpg43 x22v61l x1h93xvk x78zum5 xdt5ytf x6s0dn4 xp1r0qw xtqikln x2b8uid x1rmx8ao">
                                                    <div className="x16rqkct xho5uc7 xe8ttls" aria-hidden="true">
                                                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                        <path fill="var(--fpl-icon-color, var(--color-icon))" d="M14.496 11.501a.5.5 0 0 1 .504.491V12c0 2.381-.284 4.556-.753 6.151-.234.795-.521 1.474-.863 1.966-.332.477-.792.883-1.384.883s-1.052-.406-1.384-.883c-.342-.492-.63-1.171-.863-1.966q-.145-.496-.264-1.062a.49.49 0 0 1 .486-.588c.24 0 .446.172.497.407q.109.514.24.961c.219.744.47 1.31.726 1.678.265.382.464.453.562.453s.297-.07.563-.453c.255-.368.506-.934.725-1.678.436-1.48.712-3.556.712-5.869 0-.274.222-.499.496-.499M6.911 9.488a.49.49 0 0 1 .589.486.51.51 0 0 1-.407.498q-.515.109-.962.24c-.744.219-1.31.47-1.678.726C4.07 11.704 4 11.902 4 12s.07.296.453.563c.368.255.934.506 1.678.725C7.61 13.724 9.687 14 12 14a.5.5 0 0 1 .009 1H12c-2.381 0-4.556-.284-6.151-.753-.795-.234-1.474-.521-1.966-.863C3.405 13.052 3 12.592 3 12s.405-1.052.883-1.384c.492-.342 1.171-.63 1.966-.863q.496-.145 1.062-.265M12 9c2.381 0 4.556.284 6.151.753.795.234 1.474.521 1.966.863.477.332.883.792.883 1.384s-.405 1.052-.883 1.384c-.492.342-1.171.63-1.966.863q-.496.146-1.062.264a.49.49 0 0 1-.589-.486c0-.24.172-.447.408-.498q.514-.107.961-.239c.744-.219 1.31-.47 1.678-.726.383-.266.453-.464.453-.562s-.07-.296-.453-.562c-.368-.257-.934-.507-1.678-.726C16.39 10.276 14.313 10 12 10a.5.5 0 0 1-.009-1zm0-6c.592 0 1.052.406 1.384.883.342.492.63 1.171.863 1.966q.145.496.265 1.063a.49.49 0 0 1-.486.589.51.51 0 0 1-.498-.408 13 13 0 0 0-.24-.962c-.219-.744-.47-1.31-.726-1.678C12.298 4.071 12.099 4 12 4s-.297.07-.562.453c-.257.368-.507.934-.726 1.678C10.276 7.61 10 9.687 10 12a.5.5 0 0 1-1 .009V12c0-2.381.284-4.556.753-6.151.234-.795.521-1.474.863-1.966C10.948 3.406 11.408 3 12 3" />
                                                      </svg>
                                                    </div>
                                                    <h2>What do you want to build?</h2>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="x9f619 xh8yej3 xy2poyc xvueqy4">
                                                <div className="xqtp20y x1vjfegm x1n2onr6">
                                                  <div className="x10l6tqk x2rgi x131sewu x78zum5 xh8yej3 x13a6bvl" />
                                                </div>
                                              </div>
                                              <div className="x10l6tqk xu96u03 x3m8u43 x1qx5ct2 x47corl x1ey2m1c xzat0vo" />
                                            </div>
                                            <div className="x9f619 xh8yej3 xy2poyc xvueqy4" />
                                            <form className="x9f619 xh8yej3 xy2poyc xvueqy4">
                                              <div className="x78zum5 xdt5ytf x2lah0s xr9ek0c x1nmg3sf x7wzq59 x1ey2m1c xtqm8zl x1j6gp28">
                                                <div className="x9f619 x78zum5 x1y1aw1k xnuq7ks x18d9i69 xnm25rq x9a3u73 x1cy8zhl x127aom xkwmxny x1mgsydn x3pnbk8 xfex06f">
                                                  <div className="xmwswwx x1d25zx1 xldchaq x1j61x8r x1e96hli xq70mok xqp8s7e x78zum5 x6s0dn4 xxk0z11 x1iyjqo2 xeuugli">
                                                    <span className="xb3r6kr xuxw1ft xlyipyv">Sign up to use Figma Make</span>
                                                  </div>
                                                  <div className="xeq5yr9 x78zum5 x13a6bvl x3pnbk8 xfex06f x1c4vz4f x2lah0s xdl72j9">
                                                    <button className="xxk0z11 x1mdcibd x7zkxhu x7r0jtz xmaolms x2b8uid xeq5yr9 xxk1ais xldchaq x1j61x8r x1e96hli xq70mok xqp8s7e x2lah0s" data-fpl-component="primitive" type="button" tabIndex={0}>Sign up</button>
                                                    <div style={{ display: "contents" }} data-editor-theme="seascape" data-preferred-theme="light">
                                                      <div style={{ colorScheme: "light" } as CSSProperties} data-preferred-theme="light">
                                                        <button className="x3nfvp2 x1n2onr6 x1c5tqo3 x5jx1yq x7r0jtz xxk0z11" data-fpl-component="primitive" aria-label="Continue with Google" type="button" tabIndex={0}>
                                                          <span className="x78zum5 x6s0dn4 x3y1lgt xt970qd" style={{ "--svg-width": "18px", "--svg-height": "18px" } as CSSProperties}>
                                                            <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                                                              <path fill="#4285f4" fillOpacity="1" fillRule="evenodd" stroke="none" d="M13.72 7.159q-.002-.744-.127-1.432H7v2.708h3.767c-.162.875-.655 1.616-1.397 2.113v1.756h2.263c1.323-1.219 2.087-3.013 2.087-5.145" />
                                                              <path fill="#34a853" fillOpacity="1" fillRule="evenodd" stroke="none" d="M7 14c1.89 0 3.475-.627 4.633-1.696L9.37 10.548c-.627.42-1.43.668-2.37.668-1.824 0-3.367-1.231-3.918-2.886H.745v1.814C1.896 12.43 4.264 14 7 14" />
                                                              <path fill="#fbbc05" fillOpacity="1" fillRule="evenodd" stroke="none" d="M3.083 8.33c-.14-.42-.22-.869-.22-1.33 0-.461.08-.91.22-1.33V3.856H.745C.27 4.801 0 5.87 0 7c0 1.13.27 2.199.745 3.144z" />
                                                              <path fill="#ea4335" fillOpacity="1" fillRule="evenodd" stroke="none" d="M7 2.784c1.028 0 1.95.353 2.676 1.047l2.008-2.008C10.47.693 8.887 0 7 0 4.264 0 1.896 1.569.745 3.856L3.083 5.67C3.633 4.015 5.177 2.784 7 2.784" />
                                                            </svg>
                                                          </span>
                                                        </button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="x78zum5 x6s0dn4 x1qughib xwib8y2 x1n2onr6" data-chat-box-top-content="true" />
                                                <div className="x1n2onr6 x78zum5 xdt5ytf x2lah0s xb3r6kr x1y0btm7 xmkeg23 x1r6hh9x xaatb59 x1qgsegg x1wfwxd8 x1uczgqu x1ey2m1c xr0zj42 x15ysqaf x1v2ro7d x1hjgmb x1717udv xxs79tx x1o1pmfc x844mss xuvnsxh xhtux83" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
                                                  <div className="x78zum5 xdt5ytf x1iyjqo2 xs83m0k x1r8uery" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
                                                    <div className="x1n2onr6 x78zum5 x1iyjqo2 xs83m0k">
                                                      <div className="x1n2onr6 x78zum5 x1iyjqo2 xs83m0k" style={{ backgroundColor: "var(--color-bg-secondary)", "--composer-max-height": "203.75px", "--composer-min-height": "64px", "--composer-chatbox-default-height": "68px", "--composer-p-font-size": "var(--text-body-large-font-size)", "--composer-p-line-height": "20px", "--composer-h-font-size": "var(--text-body-large-font-size)", "--composer-h-line-height": "20px", "--composer-padding-top": "12px", "--composer-padding-bottom": "12px", "--composer-padding-left": "12px", "--composer-padding-right": "12px" } as CSSProperties} data-site-import-responsive="102">
                                                        <div className="x1iyjqo2 xs83m0k xh8yej3 x12tpnza" style={{ maxHeight: "203.75px" }} role="none" data-site-import-responsive="103">
                                                          <div className="x12tpnza" style={{ maxHeight: "203.75px" }} role="none" data-site-import-responsive="104">
                                                            <div role="none">
                                                              <div className="x1n2onr6 x1iyjqo2 xvwc6ox xsris4t xmyjduy xo1l8bm x1pahrl7 x1b6apxb x1qx4mpj x1paautr xmi8py6 xw7ystx xyeb8xt x1sxvvt8 x1mtmui3 x1893m4g x1cpjaqv xh8yej3 x9f619 x1mzt3pk x1a2a7pz xk3rhcj xalqmnw x8du1vd x7ab17h xryxfnj xt0e3qv xbyyjgo" style={{ userSelect: "text", whiteSpace: "pre-wrap", wordBreak: "break-word" } as CSSProperties} aria-autocomplete="none" aria-describedby="MakeLexicalComposer-:rh:" aria-label="Prompt for AI agent" aria-readonly="true" contentEditable="false" id="code-chat-chat-box-form" role="textbox" spellCheck="false" aria-disabled="true" aria-placeholder="">
                                                                <p dir="auto">
                                                                  <br />
                                                                </p>
                                                              </div>
                                                              <div aria-hidden="true" />
                                                            </div>
                                                          </div>
                                                          <div aria-hidden="true" hidden>
                                                            <div style={{ "--_1rthyo80": "0", "--_1rthyo81": "NaN%" } as CSSProperties} data-fpl-component="" />
                                                          </div>
                                                        </div>
                                                        <div className="x10l6tqk x3o9sft x1qomyc7 xzbkq0s xvwc6ox xsris4t xmyjduy x1j61x8r xo1l8bm x1pahrl7 x1b6apxb x47corl x87ps6o x104kibb x1ua5tub x1h7i4cw xb3r6kr x1mzt3pk xlk80a5" aria-hidden="true" id="MakeLexicalComposer-:rh:">Describe your idea</div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="x78zum5 x1q0g3np x1qughib x6s0dn4 x7os9v6 x9f619 xn3w4p2 x1gg8mnh xe8ttls x19tq306">
                                                    <div className="x78zum5 xcmnfzx x167g77z x1iyjqo2 x1qughib xeuugli" style={{ opacity: "1" }}>
                                                      <div className="x78zum5 x6s0dn4 x1kz73s x2lah0s">
                                                        <div className="x78zum5 x1q0g3np x6s0dn4 xmodvu1 xjytcot">
                                                          <button className="x2lah0s x78zum5 x6s0dn4 xl56j7k x17hesxv xt0e3qv xj6fu32 x1a81bon xjbqb8w xe6b3eb x1uwj4s0 x1q2v0gt x1a2a7pz xb9akqj x13iak60 xgd8bvy x1fgtraw" data-fpl-component="primitive" aria-controls=":rk:" aria-haspopup="menu" aria-expanded="false" id=":rk:-trigger" aria-label="Add context" type="button" aria-disabled="true" tabIndex={0}>
                                                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                                              <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M11.5 6a.5.5 0 0 1 .5.5V11h4.5a.5.5 0 0 1 0 1H12v4.5a.5.5 0 0 1-1 0V12H6.5a.5.5 0 0 1 0-1H11V6.5a.5.5 0 0 1 .5-.5" clipRule="evenodd" />
                                                            </svg>
                                                          </button>
                                                          <input className="x1s85apg" type="file" accept="image/png,image/jpeg,image/gif,.ts,.mts,.cts,.js,.mjs,.cjs,.jsx,.tsx,.css,.scss,.sass,.json,.map,.html,.htm,.handlebars,.hbs,.svg,.xml,.md,.mdx,.txt,.csv,application/pdf,.docx,.pptx,.xlsx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a,audio/m4a,audio/aac,video/mp4,video/webm" multiple />
                                                          <div className="xjp7ctv" />
                                                        </div>
                                                      </div>
                                                      <div className="x78zum5 x6s0dn4 x1kz73s x8x9d4c xeuugli">
                                                        <div className="x1n2onr6 x2lah0s">
                                                          <div style={{ display: "contents" }} data-fpl-component="primitive" role="presentation">
                                                            <button className="xt0e3qv x78zum5 x6s0dn4 x1dbijih x1ned7t2 x12fzoxp x1cemz1n x1fuw9x7 x1t0vds8 x1a2a7pz xb9akqj x13iak60 xti2d7y x1n5bzlp" data-fpl-component="primitive" aria-label="Chat mode, Build" type="button" aria-disabled="true" tabIndex={0}>
                                                              <span className="xrlp15q x1nmd3yn xm735u9 xkbmbem x3wk4up xuxw1ft">Build</span>
                                                              <svg className="x2lah0s" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                                <path fill="var(--fpl-icon-color, var(--color-icon))" d="M9.768 6.768a.5.5 0 0 1 .707.707l-2.12 2.121a.5.5 0 0 1-.708 0L5.525 7.475a.5.5 0 0 1 .708-.707l1.768 1.767z" />
                                                              </svg>
                                                            </button>
                                                          </div>
                                                        </div>
                                                        <div className="x1n2onr6 xeuugli">
                                                          <div style={{ display: "contents" }} data-fpl-component="primitive" role="presentation">
                                                            <button className="xt0e3qv x78zum5 x6s0dn4 x1dbijih x1s58uyl xeuugli x193iq5w x12fzoxp x1a2a7pz xb9akqj x13iak60 xti2d7y xjbqb8w x1n5bzlp xyftt0y x1fgtraw xf18ygs xy13l1i" data-fpl-component="primitive" aria-label="Select model, Auto" type="button" aria-disabled="true" tabIndex={0}>
                                                              <span className="xrlp15q x1nmd3yn xm735u9 xkbmbem x3wk4up x1yoeo6r xuxw1ft xeuugli xb3r6kr xlyipyv">Auto</span>
                                                              <svg className="x1b32s1p x2lah0s" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                                <path fill="var(--fpl-icon-color, var(--color-icon))" d="M9.768 6.768a.5.5 0 0 1 .707.707l-2.12 2.121a.5.5 0 0 1-.708 0L5.525 7.475a.5.5 0 0 1 .708-.707l1.768 1.767z" />
                                                              </svg>
                                                            </button>
                                                          </div>
                                                        </div>
                                                        <div className="x2lah0s">
                                                          <div className="x78zum5 x6s0dn4 x3pnbk8 xfex06f">
                                                            <button className="x2lah0s x78zum5 x6s0dn4 xl56j7k x17hesxv xt0e3qv x1a2a7pz xb9akqj x13iak60 xgd8bvy x1fgtraw xj6fu32 x1a81bon xjbqb8w xyssdx xjs17eo" data-fpl-component="primitive" aria-label="Dictate" type="button" aria-disabled="true" tabIndex={0}>
                                                              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                <path fill="var(--fpl-icon-color, var(--color-icon))" d="M16.5 11.5a.5.5 0 0 1 .5.5 5 5 0 0 1-4.5 4.975V18h2a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h2v-1.025A5 5 0 0 1 7 12a.5.5 0 0 1 1 0 4 4 0 0 0 8 0 .5.5 0 0 1 .5-.5M12 5a3 3 0 0 1 3 3v4l-.004.154a3 3 0 0 1-5.992 0L9 12V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v4a2 2 0 1 0 4 0V8a2 2 0 0 0-2-2" />
                                                              </svg>
                                                            </button>
                                                            <div style={{ "--fpl-contents-height": "initial", "--fpl-contents-max-height": "initial" } as CSSProperties} data-fpl-component="" hidden data-fullscreen-prevent-event-capture="true" aria-modal="true" role="dialog" aria-labelledby=":rv:" tabIndex={-1}>
                                                              <div />
                                                              <div data-fpl-component="">
                                                                <section>
                                                                  <div data-fpl-component="true">
                                                                    <div data-fpl-component="">
                                                                      <h2 data-fpl-component="" id=":rv:">Microphone access required</h2>
                                                                    </div>
                                                                    <div role="none">
                                                                      <div role="none" data-fpl-component="">
                                                                        <div role="none">
                                                                          <div className="x78zum5 xdt5ytf x1wka9du">
                                                                            <p className="xrlp15q x1nmd3yn xm735u9 xkbmbem x3wk4up xmaolms x1ghz6dp">To use voice input, you need to allow Figma to access your microphone.</p>
                                                                            <div className="x78zum5 xdt5ytf x13jbr9k">
                                                                              <p className="xrlp15q x1nmd3yn xm735u9 xkbmbem x3wk4up xmaolms x1ghz6dp">To enable microphone access:</p>
                                                                              <ol className="xrlp15q x1nmd3yn xm735u9 xkbmbem x3wk4up xzaptrt xrqax6d">
                                                                                <li>Click the lock or settings icon in your browser’s address bar</li>
                                                                                <li>Find the microphone permission and change it to "Allow"</li>
                                                                                <li>Reload the page and try again</li>
                                                                              </ol>
                                                                            </div>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                      <div aria-hidden="true" hidden>
                                                                        <div style={{ "--_1rthyo80": "0", "--_1rthyo81": "NaN%" } as CSSProperties} data-fpl-component="" />
                                                                      </div>
                                                                    </div>
                                                                    <div data-fpl-component="">
                                                                      <button data-fpl-component="" type="button" tabIndex={0}>
                                                                        <span>
                                                                          <span>
                                                                            <span>Got it</span>
                                                                          </span>
                                                                        </span>
                                                                      </button>
                                                                    </div>
                                                                  </div>
                                                                  <div data-fpl-component="">
                                                                    <button data-fpl-component="" aria-label="Close" type="button" tabIndex={0}>
                                                                      <span aria-hidden="true">
                                                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                          <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M16.854 7.146a.5.5 0 0 1 0 .707L12.707 12l4.147 4.146a.5.5 0 0 1-.708.707L12 12.708l-4.146 4.147a.5.5 0 1 1-.708-.708L11.293 12 7.146 7.854a.5.5 0 0 1 .708-.708L12 11.293l4.146-4.147a.5.5 0 0 1 .708 0" clipRule="evenodd" />
                                                                        </svg>
                                                                      </span>
                                                                    </button>
                                                                  </div>
                                                                </section>
                                                              </div>
                                                              <div />
                                                            </div>
                                                            <div className="x78zum5 x6s0dn4 xl56j7k x11umrmk">
                                                              <button className="x17hesxv xlqzeqv x6s0dn4 x78zum5 x2lah0s x1a2a7pz xb9akqj x13iak60 xyv8yvc xgd8bvy x1fgtraw" style={{ width: "28px" }} aria-disabled="true" type="button" aria-label="Send">
                                                                <div className="x1n2onr6 x78zum5 x6s0dn4 xl56j7k xgd8bvy x1fgtraw" style={{ transform: "none" }}>
                                                                  <div className="x10l6tqk" style={{ opacity: "1", transform: "none" }}>
                                                                    <svg className="x1ms3vpc xvy4d1p xxk0z11 x2lah0s" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                      <path fill="var(--fpl-icon-color, var(--color-icon))" d="M11.725 5.582a.5.5 0 0 1 .629.064l4.5 4.5a.5.5 0 0 1-.707.707L12.5 7.207V18a.5.5 0 0 1-1 0V7.207l-3.646 3.646a.5.5 0 0 1-.707-.707l4.5-4.5z" />
                                                                    </svg>
                                                                  </div>
                                                                </div>
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </form>
                                            <div className="x10l6tqk x13vifvy xu96u03 x3m8u43 x1ey2m1c x78zum5 x6s0dn4 xl56j7k x4qgb6o xzkaem6">
                                              <div data-fpl-component="" aria-relevant="all" role="status">
                                                <div>Loading</div>
                                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                                  <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M15.333 7.011a6 6 0 0 0-2.834-.99A.534.534 0 0 1 12 5.5c0-.276.224-.502.5-.482A7 7 0 1 1 5.018 12.5.473.473 0 0 1 5.5 12c.276 0 .498.224.52.5a6 6 0 1 0 9.313-5.489" clipRule="evenodd" />
                                                </svg>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div data-fpl-component="" tabIndex={0} role="slider" aria-label="Resize handle" aria-orientation="horizontal" aria-valuenow={368} aria-valuetext="368 pixels" aria-valuemin={340} aria-valuemax={500} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ "--fpl-contents-height": "initial", "--fpl-contents-max-height": "initial" } as CSSProperties} data-fpl-component="" hidden data-fullscreen-prevent-event-capture="true" aria-modal="true" role="dialog" aria-labelledby=":r12:" tabIndex={-1}>
                          <div />
                          <div data-fpl-component="">
                            <section>
                              <div data-fpl-component="true">
                                <div data-fpl-component="">
                                  <h2 data-fpl-component="" id=":r12:">Reload to continue</h2>
                                </div>
                                <div role="none">
                                  <div role="none" data-fpl-component="">
                                    <div role="none">You’re using an outdated version of Figma Make. Don’t worry—we’ll save all your work when you reload.</div>
                                  </div>
                                  <div aria-hidden="true" hidden>
                                    <div style={{ "--_1rthyo80": "0", "--_1rthyo81": "NaN%" } as CSSProperties} data-fpl-component="" />
                                  </div>
                                </div>
                                <div data-fpl-component="">
                                  <div data-fpl-component="">
                                    <button data-fpl-component="" type="button" tabIndex={0}>
                                      <span>
                                        <span>
                                          <span>Save and reload</span>
                                        </span>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </div>
                          <div />
                        </div>
                        <div data-fullscreen-prevent-event-capture="true">
                          <div className="x9f619 x10l6tqk x78zum5 x1qjc9v5 x1szn6h9 x10a8y8t x4qgb6o" style={{ left: "368px", right: "0px", top: "0px" }}>
                            <div className="x4qgb6o x1iyjqo2 xs83m0k x1t1x2f9 xe0pwq x19ypqd9 xa0awrb x78zum5 xdt5ytf xb3r6kr x1n2onr6">
                              <div className="x1n2onr6 x1vjfegm">
                                <div className="xe8ttls x78zum5 x6s0dn4 x1qughib xso031l x1q0q8m5 x1hxpj6c xk82a7y x15sc1rj x1n2onr6 x4qgb6o x10w6t97">
                                  <div className="x78zum5 x6s0dn4 xs83m0k x1iyjqo2 x1r8uery x1nhvcw1 x3pnbk8 xfex06f">
                                    <div className="x78zum5 x6s0dn4 x1qughib xho5uc7 x17hesxv x1y0btm7 x9r1u3d xhtux83 xmkeg23 xy2penl x10w6t97 x1innc2r x1v46tqf x1r0jzty x17zd0t2 x1o4o3hk">
                                      <button data-fpl-component="" aria-label="Reload" type="button" tabIndex={0}>
                                        <span aria-hidden="true">
                                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M10.003 7.375A5.5 5.5 0 0 1 16.61 9.5H14a.5.5 0 0 0 0 1h3.5a.5.5 0 0 0 .5-.5V6.5a.5.5 0 0 0-1 0v1.847a6.5 6.5 0 1 0-.128 8.456.5.5 0 1 0-.75-.662 5.5 5.5 0 1 1-6.119-8.766" clipRule="evenodd" />
                                          </svg>
                                        </span>
                                      </button>
                                      <div className="x78zum5 x6s0dn4 x1iyjqo2">
                                        <span className="xlk80a5 x1innc2r x1qldnbg">/</span>
                                        <input className="xh8yej3 x1a2a7pz x1717udv xjbqb8w x1iyjqo2 xs83m0k xlyipyv xsfwcq x1hqfjtz" aria-label="Path to page or screen" id="header-nav-toolbar-input" autoCapitalize="none" autoCorrect="off" spellCheck="false" defaultValue="" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="x78zum5 x6s0dn4 xl56j7k x3pnbk8 xfex06f x1iyjqo2 xs83m0k x1t1x2f9" />
                                  <div className="x78zum5 x6s0dn4 x3pnbk8 xfex06f xs83m0k x1iyjqo2 x1r8uery x13a6bvl">
                                    <div className="x1x862rh">
                                      <span className="multiplayer_view--multiplayerRow--yh5Fw">
                                        <div data-fpl-component="" role="none">
                                          <span data-fpl-component="">
                                            <span>
                                              <div>
                                                <button className="multiplayer_view--selfAvatarWithToolsContainer--F-aL0 multiplayer_view--fullHeightSidebarAvatarWithToolsOverrides--Jf0Xr" aria-label="Multiplayer tools" id="self-avatar-with-tools-container">
                                                  <span className="multiplayer_view--disabled--bdNgo">
                                                    <span className="x1lliihq x1n2onr6 xz9q8dd">
                                                      <div className="multiplayer_view--userIconView--26339">
                                                        <div style={{ display: "inherit" } as CSSProperties} id="voice-avatar-session-89">
                                                          <svg viewBox="0 0 30 40" aria-hidden="true">
                                                            <circle cx="15" cy="20" r="13" fill="none" stroke="var(--color-bg-brand)" strokeWidth="2" />
                                                          </svg>
                                                          <div className="multiplayer_view--normal--KEQui">
                                                            <div className="x6s0dn4 x3nfvp2 x2lah0s xl56j7k x16dsc37 xorixrz x1n2onr6 x2b8uid xfifm61 x1o2sk6j x1pmkra8" aria-hidden="true">
                                                              <div data-fpl-component="" aria-label="" role="img">
                                                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                  <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0m1 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0m-9.75 8.006a.48.48 0 0 0 .054.612c.233.235.619.167.811-.103A5.99 5.99 0 0 1 12 15c2.014 0 3.797.992 4.885 2.515.192.27.578.338.81.102a.48.48 0 0 0 .054-.611A6.99 6.99 0 0 0 12 14a6.99 6.99 0 0 0-5.75 3.006" clipRule="evenodd" />
                                                                </svg>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </span>
                                                  </span>
                                                  <span className="multiplayer_view--onboardingTarget--p2dJa" />
                                                </button>
                                              </div>
                                            </span>
                                          </span>
                                        </div>
                                      </span>
                                    </div>
                                    <button data-fpl-component="primitive" aria-label="Preview" type="button" tabIndex={0}>
                                      <span aria-hidden="true">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                          <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M6 5.903C6 4.43 7.604 3.517 8.87 4.269l10.15 6.028c1.307.776 1.305 2.669-.003 3.442l-10.15 5.995c-1.228.724-2.768-.11-2.863-1.5L6 18.098zm1 12.195a.9.9 0 0 0 1.357.774l10.152-5.995a1 1 0 0 0 .002-1.72L8.359 5.129A.9.9 0 0 0 7 5.903z" clipRule="evenodd" />
                                        </svg>
                                      </span>
                                    </button>
                                    <button data-fpl-component="" type="button" tabIndex={0}>
                                      <span>
                                        <span>
                                          <span>Share</span>
                                        </span>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="x78zum5 xb3r6kr xh8yej3 x1iyjqo2 xs83m0k x1t1x2f9 x2lwn1j x1qjc9v5 x1n2onr6">
                                <div className="" style={{ display: "flex", flexDirection: "row", height: "100%", overflow: "hidden", width: "100%" }}>
                                  <div className="" style={{ flex: "1 1 0px", overflow: "hidden" }}>
                                    <div className="" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", width: "100%" }}>
                                      <div className="" style={{ flex: "1 1 0px", overflow: "hidden" }}>
                                        <div className="x1lliihq xh8yej3 x5yr21d x1n2onr6">
                                          <div className="x1n2onr6 xh8yej3 x5yr21d xb3r6kr x1iyjqo2 xs83m0k x1t1x2f9">
                                            <div className="xh8yej3 x5yr21d x1n2onr6 xb3r6kr">
                                              <div className="xh8yej3 x5yr21d xysyzu8 x78zum5 xl8spv7" style={{ "--x-backgroundColor": "var(--color-bg-secondary)" } as CSSProperties}>
                                                <div className="x1n2onr6 x78zum5 x6s0dn4 xl56j7k xdt5ytf x1bpp3o7 x12651j4 x1pqx817" style={{ "--x-zoom": "0.8579335793357933" } as CSSProperties} data-site-import-responsive="197">
                                                  <div className="x78zum5 x6s0dn4 x1n2onr6">
                                                    <div className="x1n2onr6 x1rg5ohu x5lhr3w x16ye13r" style={{ "--x-width": "436.6666666666667px", "--x-height": "903.3333333333334px" } as CSSProperties}>
                                                      <div className="x10l6tqk xb3r6kr x1qgsegg xaatb59 xfu5tiv x42x0ya xi9hqdr" style={{ width: "92.0611%", height: "96.7528%", left: "3.96947%", top: "1.62362%", borderRadius: "6%" }}>
                                                        <div className="x10l6tqk x13vifvy xu96u03 x3m8u43 x1ey2m1c x78zum5 x6s0dn4 xl56j7k x4qgb6o" />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="x2lah0s x2lwn1j x4qgb6o x19ypqd9 xa0awrb xb3r6kr x1n2onr6 x5lhr3w xvc91ea x1ibsj99" style={{ "--x-width": "0px", "--x-borderLeftWidth": "0px", "--x-transition": "width 200ms ease, border-left-width 200ms ease" } as CSSProperties}>
                                    <div className="x10l6tqk x13vifvy x1ey2m1c xu96u03 x78zum5 xdt5ytf x8sodaf x5lhr3w" style={{ "--x-width": "300px", "--x---properties-panel-width": "300px" } as CSSProperties} />
                                  </div>
                                </div>
                              </div>
                              <div className="x10l6tqk x10a8y8t x47corl xr3buco" style={{ "--x-zIndex": "21" } as CSSProperties} />
                              <div className="x1n2onr6 x1wb5xmz" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ marginBottom: "0px" }} data-fullscreen-prevent-event-capture="true" />
                      <div style={{ zIndex: "14", position: "fixed", inset: "0px", isolation: "isolate", pointerEvents: "none" }} id="lint-error-container" />
                    </div>
                  </div>
                </div>
                <div className="jsvm_ui--pluginUI--G6oUT in_app_page--appFont--PJJ3L" style={{ display: "none" }} />
                <div>
                  <div role="region" aria-label="Help/zoom toolbar">
                    <div style={{ marginBottom: "0px", "--cookieBannerHeight": "0px" } as CSSProperties}>
                      <div className="x1q0g3np x78zum5 xrdokzc xuk3077 x1n2onr6 x1vjfegm" data-fpl-component="primitive" aria-label="Help/zoom toolbar" role="toolbar" aria-orientation="horizontal">
                        <div className="xdt5ytf xp1r0qw xtqikln xl56j7k xuk3077">
                          <div style={{ display: "contents" }} data-fpl-component="primitive" role="presentation">
                            <span>
                              <button aria-expanded={openMenu0 === "observed-0"} onClick={event => { event.preventDefault(); event.stopPropagation(); setOpenMenu0(open => open === "observed-0" ? null : "observed-0"); }} data-fpl-component="primitive" aria-haspopup="menu" id=":r2:" aria-label="Help" type="button" tabIndex={0} aria-controls=":r1:">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                  <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M11.69 16.572q.357 0 .61.254a.83.83 0 0 1 .26.616q0 .236-.12.435a.9.9 0 0 1-.315.32.84.84 0 0 1-.435.114.85.85 0 0 1-.615-.253.85.85 0 0 1-.254-.616.84.84 0 0 1 .254-.616.85.85 0 0 1 .615-.254m.332-10.884q1.002 0 1.763.416.76.41 1.19 1.13.428.712.428 1.635 0 .61-.193 1.111a2.9 2.9 0 0 1-.58.924 4.8 4.8 0 0 1-.954.797 4.6 4.6 0 0 0-.863.718 2.1 2.1 0 0 0-.459.815q-.138.453-.15 1.117c0 .18-.146.326-.326.326h-.44a.326.326 0 0 1-.327-.326q.006-.954.21-1.551.207-.598.604-1.009a5.5 5.5 0 0 1 1.003-.797q.447-.29.748-.61.308-.325.465-.711a2.2 2.2 0 0 0 .163-.852q0-.651-.307-1.14a2.04 2.04 0 0 0-.822-.755 2.45 2.45 0 0 0-1.153-.272q-.603 0-1.129.266a2.15 2.15 0 0 0-1.138 1.483c-.067.3-.312.545-.619.545-.323 0-.588-.269-.53-.587a3.12 3.12 0 0 1 1.678-2.268 3.7 3.7 0 0 1 1.738-.405" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          </div>
                          <div />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ position: "absolute", top: "402px", left: "768px", transform: "translate(-359px, -256px)" }} id="comment-preview-outlet" data-fullscreen-prevent-event-capture="true" />
                <div>
                  <div style={{ left: "0px", top: "0px", zIndex: "1" }} data-fpl-component="" data-fullscreen-prevent-event-capture="true" hidden role="dialog" aria-labelledby=":r5:" tabIndex={-1}>
                    <div style={{ width: "fit-content", height: "fit-content", "--fpl-contents-height": "100%", "--fpl-contents-max-height": "100%", "--xbzsgh0": "300.0px" } as CSSProperties} data-fpl-component="primitive">
                      <div data-fpl-component="true">
                        <div role="region" aria-label="Plugin">
                          <div data-fpl-component="">
                            <h2 data-fpl-component="" id=":r5:">
                              <div className="x78zum5 x1qughib x2b8uid xt0e3qv x87ps6o">
                                <div style={{ display: "flex", alignItems: "center", flex: "1 1 0%" }}>
                                  <div className="header_modal--headerModalTitleWithoutOverflow--1UgiR header_modal--headerModalTitle--AiLjQ ellipsis--ellipsis--IdJAr" style={{ maxWidth: "calc(180px)" }} />
                                </div>
                              </div>
                            </h2>
                            <div data-fpl-component="">
                              <div className="x78zum5 x6s0dn4 x1sk9g4k x156m2f4 xlbdvbg" />
                            </div>
                          </div>
                          <div role="none">
                            <div role="none" data-fpl-component="">
                              <div style={{ padding: "0px" }} role="none" />
                            </div>
                            <div aria-hidden="true" hidden>
                              <div style={{ "--_1rthyo80": "0", "--_1rthyo81": "NaN%" } as CSSProperties} data-fpl-component="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-fpl-component="">
                      <button data-fpl-component="" aria-label="Close" type="button" tabIndex={0}>
                        <span aria-hidden="true">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M16.854 7.146a.5.5 0 0 1 0 .707L12.707 12l4.147 4.146a.5.5 0 0 1-.708.707L12 12.708l-4.146 4.147a.5.5 0 1 1-.708-.708L11.293 12 7.146 7.854a.5.5 0 0 1 .708-.708L12 11.293l4.146-4.147a.5.5 0 0 1 .708 0" clipRule="evenodd" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: "none" }}>
                  <div style={{ display: "contents" }} data-preferred-theme="light">
                    <div style={{ "--_1kdzox90": "26.25rem", "--fpl-contents-height": "initial", "--fpl-contents-max-height": "initial" } as CSSProperties} data-fpl-component="" data-fullscreen-prevent-event-capture="true" aria-modal="true" role="dialog" aria-labelledby=":r1q:" tabIndex={-1}>
                      <div />
                      <div data-fpl-component="">
                        <ImportedSectionCreateAnAccountTo />
                      </div>
                      <div />
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ display: "contents" }} data-preferred-theme="light">
                    <div style={{ "--_1kdzox90": "26.25rem", "--fpl-contents-height": "initial", "--fpl-contents-max-height": "initial" } as CSSProperties} data-fpl-component="" data-fullscreen-prevent-event-capture="true" aria-modal="true" role="dialog" aria-labelledby=":r1u:" tabIndex={-1}>
                      <div />
                      <div data-fpl-component="">
                        <ImportedSectionSignUpForFigma />
                      </div>
                      <div />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="xqui205 xixxii4 x13vifvy xu96u03 x2b8uid x1of6sz5 xh8yej3" />
                <div className="x1hq5gj4 xixxii4 x1ey2m1c xu96u03 x2b8uid x1of6sz5 xh8yej3" />
                <div data-fpl-component="primitive" aria-relevant="all" role="status" />
                <div className="visual_bell_DEPRECATED--base--ajlBE visual_bell_DEPRECATED--fplBase--ebudn" style={{ transform: "translateY(100vh) translateX(184px)" }}>
                  <div style={{ display: "contents" }} data-editor-theme="seascape" data-preferred-theme="dark">
                    <div data-fpl-component="" role="presentation">
                      <div role="group">
                        <span className="xjp7ctv">
                          <div data-fpl-component="" aria-relevant="all" role="alert">
                            <span />
                            <span />
                          </div>
                        </span>
                        <span className="x10l6tqk x1nj6f5o">
                          <div data-fpl-component="" aria-relevant="all" role="alert" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "contents" }} data-editor-theme="seascape" data-preferred-theme="dark">
                  <div className="blocked_ui_loading_indicator--base--5a5lQ blocked_ui_loading_indicator--fpl--NxLQr" style={{ transform: "translateY(-64px)" }} />
                </div>
              </div>
              <div />
              <div />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={"fb-page-layout \x68idden fadeOut [transition:opacity_0.2s_ease-in-out]"} id="filebrowser-loading-page">
          <div aria-hidden="true">
            <div id="filebrowser-loading-progress-bar" />
            <div className="fb-flex-row">
              <div className="fb-sidebar pt-[4px]" id="filebrowser-loading-sidebar">
                <div className="fb-sidebar-account-and-notifications">
                  <div className="fb-circle-24 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-120" />
                </div>
                <div className="fb-sidebar-searchbar">
                  <div className="fb-rectangle-32 fb-width-full" />
                </div>
                <div className="fb-sidebar-row">
                  <div className="fb-rectangle-16 fb-width-16 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-70" />
                </div>
                <div className="fb-divider" />
                <div className="fb-sidebar-row">
                  <div className="fb-circle-16" />
                  <div className="fb-rectangle-16 fb-width-115" />
                </div>
                <div className="fb-sidebar-row">
                  <div className="fb-rectangle-16 fb-width-16 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-70" />
                </div>
                <div className="fb-sidebar-row">
                  <div className="fb-rectangle-16 fb-width-16 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-100" />
                </div>
                <div className="fb-sidebar-row">
                  <div className="fb-rectangle-16 fb-width-60" />
                </div>
                <div className="fb-sidebar-row">
                  <div className="fb-rectangle-16 fb-width-16 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-100" />
                </div>
                <div className="fb-sidebar-row">
                  <div className="fb-rectangle-16 fb-width-16 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-80" />
                </div>
                <div className="fb-sidebar-row">
                  <div className="fb-rectangle-16 fb-width-16 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-120" />
                </div>
                <div className="fb-sidebar-row">
                  <div className="fb-rectangle-16 fb-width-16 fb-shrink-0" />
                  <div className="fb-rectangle-16 fb-width-105" />
                </div>
              </div>
              <div className="fb-page">
                <div className="fb-toolbar-48">
                  <div className="fb-rectangle-16 fb-width-120" />
                </div>
                <div className="fb-page-content-columns"><div className="fb-page-content"><div id="loading-content-pane"><div className="fb-fading-content"><div className="fb-tile-grid fb-tile-grid-top-padding justify-items-stretch"><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div><div className="fb-card"><div className="fb-file-thumbnail [aspect-ratio:16/9]" /><div className="fb-file-card-footer"><div className="fb-rectangle-16 fb-width-16" /><div className="fb-file-card-footer-text-container"><div className="fb-rectangle-16 fb-width-120" /><div className="fb-rectangle-16 fb-width-88" /></div></div></div></div></div></div></div>

               


              
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ visibility: "hidden" }} id="fullscreen-root">
        <div className="view" style={{ inset: "0px", width: "auto", height: "auto" }}>
          <div className="view" style={{ inset: "0px", width: "auto", height: "auto" }}>
            <div className="view" style={{ inset: "0px", width: "auto", height: "auto" }}>
              <div className="view" style={{ inset: "0px", width: "auto", height: "auto" }}>
                <div className="view gpu-view-content" style={{ display: "block", inset: "0px", width: "auto", height: "auto" }}>
                  <picture style={{ display: "contents" }}>
                    <source media="(max-width: 767px)" srcSet="data:image/webp;base64,UklGRqYEAABXRUJQVlA4WAoAAAAgAAAAhQEASwMASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgguAIAAHBMAJ0BKoYBTAM+MRiMRKIhoRAkACADBLS3cLuwjaAJ7Xoq4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVUmu20XCDIIaqk122i4QZBDVTYhDLxfyOidE6J0TonRDNK0mKk+duWvRVwgvQAAP7/9gwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF3/B9RspJV2O/Si6wB0U/UhORZJGkZqpPYr1EFAOWRfOX/HoAAAAA==" />
                    <img style={{ width: "1536px", height: "864px" }} width="1536" height="864" data-site-import-responsive="590" src="data:image/webp;base64,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nASk5A75X4wpezag6iJ1WsBghZoaheeq7gFVhzhsYnEvjtR64Gk4TTV1mXi9NNXWZeL001dZl4vTTV1mYC4sGgO6tsm249pH7Lq4O7mt54145zbNRWZz5ak5cUq0QPmnPGD2I8UPzVCoGmZP61wbqOLOaVmZryQXMvXE8He9vdeX9Noy9qausy8Xppq6zLxemmrrMvF6aaus7WKVbmDc8pruzaRxc21OpZLmL1gAatu7HAXE5iO+vXC4nVq96RJKsw4LV09S+y2YKhmgv3+kFr2v6TL2pq6zLxemmrrMvF6aausy8Xppq76yLQ19UYegGA5A7B60IU9G5PkK0sIgz0SurSJ1cd5n8QMjC830bWXtSGnJ9HSCSh+jBoNlzIx150ddBa9r+ky9qausy8Xppq6zLxemmrrMvF6aau+sisOuFfvnARGo8Z8hDRBcLi1+bVGH0OvdUmuYadTzKrJAoJJqBGsbhafLDOmrMBc65GstZdFPdLqlry9r+ky9qausy8Xppq6zLxemmrrMvF6aau+si3UxesAkYB4EVP/KCcBzwsB+U2V/89tQohsX6dArMutANMKAmXtTV1mXi9NNXWZeL001dZl4vTUMCuNAOmVFEBhsrh1Ed95uF3pWSaNrnbe99LG+sk0bWNwtSDu5MKWDf316+jE5iTC830bXMSYV6+jaxrNk8tGXtTV1mXi9NNXWZeL001dZl4vTTV1ncFATL2pq6zL7PqeBkoX2/IT9tZOt17LvwucZmXtTV1mXi9NNXWZeL001dZl4vLLD33tF5hUjWfI6tl+17ReYVI1nyOrZfte0XjxncynOMzL2pq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6aausy8Xppq6zLxemmrrMvF6UAAD+/zYcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwGgAA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" data-site-import-static-fallback="canvas" alt="" />
                  </picture>
                </div>
              </div>
            </div>
            <div className="view" style={{ inset: "0px auto 0px 0px", width: "0px", height: "auto" }} />
            <div className="view" style={{ inset: "0px auto 0px 0px", width: "2px", height: "auto" }} />
          </div>
          <div style={{ position: "absolute", inset: "0px", isolation: "isolate", zIndex: "7", pointerEvents: "none" }} id="canvas-overlay-paint-order-mount" />
        </div>
        <div className="focus-target" contentEditable="true" role="document" aria-multiline="true" tabIndex={-1} aria-hidden="true" spellCheck="false" autoCorrect="off" aria-expanded="false" aria-haspopup="listbox" aria-autocomplete="list">⁨⁩</div>
        <input className="focus-target" style={{ top: "-200px" }} readOnly tabIndex={-1} aria-hidden="true" role="application" aria-label="Figma Design" />
      </div>
      <ul aria-hidden={openMenu0 === "observed-0" ? undefined : (undefined)} data-state={openMenu0 === "observed-0" ? undefined : (undefined)} hidden={openMenu0 === "observed-0" ? undefined : (true)} inert={openMenu0 === "observed-0" ? undefined : (false)} {...{ open: (openMenu0 === "observed-0" ? undefined : (false)) ? "" : undefined }} style={openMenu0 === "observed-0" ? {} : ({ display: "none" })} data-fpl-component="primitive" tabIndex={-1} id=":r1:" role="menu" aria-labelledby=":r2:" aria-orientation="vertical" data-site-import-observed-popup="">
        <div data-fpl-component="primitive" aria-hidden="true">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="var(--fpl-icon-color, var(--color-icon))" d="M11.225 10.082a.5.5 0 0 1 .629.064l2.5 2.5a.5.5 0 0 1-.707.707L11.5 11.207l-2.146 2.146a.5.5 0 1 1-.708-.707l2.5-2.5z" />
          </svg>
        </div>
        <a aria-disabled="false" data-fpl-component="" data-fpl-selected="true" href="https://help.figma.com/hc/categories/31304285531543-Figma-Make" rel="noopener nofollow noreferrer ugc" role="menuitem" tabIndex={0} target="_blank">
          <span>
            <div>Learn about Make</div>
          </span>
        </a>
        <a aria-disabled="false" data-fpl-component="" href="https://help.figma.com/" rel="noopener nofollow noreferrer ugc" role="menuitem" tabIndex={-1} target="_blank">
          <span>
            <div>Help Center</div>
          </span>
        </a>
        <a aria-disabled="false" data-fpl-component="" href="https://www.youtube.com/figmadesign" rel="noopener nofollow noreferrer ugc" role="menuitem" tabIndex={-1} target="_blank">
          <span>
            <div>YouTube videos</div>
          </span>
        </a>
        <a aria-disabled="false" data-fpl-component="" href="/release-notes" rel="noopener" role="menuitem" tabIndex={-1} target="_blank">
          <span>
            <div>Release notes</div>
          </span>
        </a>
        <a aria-disabled="false" data-fpl-component="" href="/legal" rel="noopener" role="menuitem" tabIndex={-1} target="_blank">
          <span>
            <div>Legal summary</div>
          </span>
        </a>
        <div>
          <li role="menuitem" tabIndex={-1} data-fpl-component="">
            <span>
              <div>Report abuse</div>
            </span>
          </li>
        </div>
        <li data-fpl-component="" role="separator" />
        <div>
          <li role="menuitem" tabIndex={-1} data-fpl-component="">
            <span>
              <div>Change language…</div>
            </span>
          </li>
        </div>
        <div data-fpl-component="primitive" aria-hidden="true">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="var(--fpl-icon-color, var(--color-icon))" d="M13.647 10.647a.5.5 0 0 1 .707.707l-2.5 2.5a.5.5 0 0 1-.707 0l-2.5-2.5a.5.5 0 0 1 .707-.707l2.146 2.146z" />
          </svg>
        </div>
      </ul>
    </>
  );
}

function ImportedSectionCreateAnAccountTo() {
  return (
    <section>
      <div data-fpl-component="true">
        <div role="none">
          <div role="none" data-fpl-component="">
            <div role="none">
              <div className="auth_modal--modal--rVpQe" />
              <div>
                <div style={{ display: "contents" }} translate="no">
                  <form className="auth_view--centerText--ryEZn auth_form--modal--DMc3h auth_brand--figmaSans--Ba2vO auth_brand--figmaSans--Ba2vO" id="auth-view-modal">
                    <div className="auth_form--topMatter--s9BIN">
                      <h1 className="auth_form--longHeader--x4iUx auth_form--headerBase--dPZBh auth_brand--figmaSans--Ba2vO" tabIndex={-1}>Create an account to collaborate on "Parking Finder App Prototype"</h1>
                    </div>
                    <button className="auth_view--brandButton--dD0L7 auth_view--brandButtonBase--EdORb auth_brand--figmaSans--Ba2vO auth_view--brandButton--dD0L7 auth_view--brandButtonBase--EdORb auth_brand--figmaSans--Ba2vO" type="button" {...({ use: "hollow" } as any)}>
                      <span>
                        <span>
                          <span style={{ height: "18px", width: "18px" }} {...({ width: "18px", height: "18px" } as any)}>
                            <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                              <path fill="#4285f4" fillOpacity="1" fillRule="evenodd" stroke="none" d="M17.64 9.2q-.002-.956-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                              <path fill="#34a853" fillOpacity="1" fillRule="evenodd" stroke="none" d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18" />
                              <path fill="#fbbc05" fillOpacity="1" fillRule="evenodd" stroke="none" d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042z" />
                              <path fill="#ea4335" fillOpacity="1" fillRule="evenodd" stroke="none" d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71" />
                            </svg>
                          </span>
                          <span>Continue with Google</span>
                        </span>
                      </span>
                    </button>
                    <p className="sign_in_and_up--orBlock--vzasA">or</p>
                    <div className="x1n2onr6 xdpxx8g x9dczf4 xh8yej3">
                      <label className="x10l6tqk x1lliihq xuzi1b7 xtvhhri x1j6dyjg xo1l8bm xjbqb8w xmaolms xgwajed x11vz743 x563n8i" htmlFor="email">Email</label>
                      <input className="xjyslct xmaolms x1lliihq xh8yej3 x9dczf4 x9f619 x1kxipp6 xosj86m xc8nv1x x1kogg8i x101yacv x1pga9m1 x17410jd xqhu3d4 xf3yja8 xc342km xng3xce x9r1u3d xm3xvbb x1gnnqk1 x178j727 xq8o014 x1rhcbux xxqzaim x1robv96 lazy_input--lazyInput--akTHe" id="email" aria-describedby="email-error-text" aria-invalid="false" autoCapitalize="off" autoComplete="username" autoCorrect="off" name="email" type="email" dir="auto" defaultValue="" />
                    </div>
                    <div style={{ height: "24px" }} />
                    <button className="auth_view--brandButton--dD0L7 auth_view--brandButtonBase--EdORb auth_brand--figmaSans--Ba2vO sign_in_and_up--primaryWideButton--6QBTr auth_view--primaryWideButton--swKV2 auth_view--wideButton--zNJFc auth_view--fullWidth--KjWzg" type="submit">
                      <span><span className="svg-container" {...({ width: "24px", height: "24px" } as any)}><svg className="svg" xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21"><path fill="#fff" fillRule="evenodd" d="M11.957 3.719 18.5 10.5l-6.543 6.781-.642-.62 5.515-5.715H4.5v-.892h12.33l-5.515-5.715z" clipRule="evenodd" /></svg></span>Continue with email</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" hidden>
            <div style={{ "--_1rthyo80": "0", "--_1rthyo81": "NaN%" } as CSSProperties} data-fpl-component="" />
          </div>
        </div>
      </div>
      <div data-fpl-component="">
        <button data-fpl-component="" aria-label="Close" type="button" tabIndex={0}>
          <span aria-hidden="true">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M16.854 7.146a.5.5 0 0 1 0 .707L12.707 12l4.147 4.146a.5.5 0 0 1-.708.707L12 12.708l-4.146 4.147a.5.5 0 1 1-.708-.708L11.293 12 7.146 7.854a.5.5 0 0 1 .708-.708L12 11.293l4.146-4.147a.5.5 0 0 1 .708 0" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}

function ImportedSectionSignUpForFigma() {
  return (
    <section>
      <div data-fpl-component="true">
        <div role="none">
          <div role="none" data-fpl-component="">
            <div role="none">
              <div className="auth_modal--modal--rVpQe" />
              <div>
                <div style={{ display: "contents" }} translate="no">
                  <form className="auth_view--centerText--ryEZn auth_form--modal--DMc3h auth_brand--figmaSans--Ba2vO auth_brand--figmaSans--Ba2vO" id="auth-view-modal">
                    <div className="auth_form--topMatter--s9BIN">
                      <h1 className="auth_form--header--fr1Af auth_form--headerBase--dPZBh auth_brand--figmaSans--Ba2vO" tabIndex={-1}>Sign up for Figma</h1>
                    </div>
                    <button className="auth_view--brandButton--dD0L7 auth_view--brandButtonBase--EdORb auth_brand--figmaSans--Ba2vO auth_view--brandButton--dD0L7 auth_view--brandButtonBase--EdORb auth_brand--figmaSans--Ba2vO" type="button" {...({ use: "hollow" } as any)}>
                      <span>
                        <span>
                          <span style={{ height: "18px", width: "18px" }} {...({ width: "18px", height: "18px" } as any)}>
                            <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                              <path fill="#4285f4" fillOpacity="1" fillRule="evenodd" stroke="none" d="M17.64 9.2q-.002-.956-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                              <path fill="#34a853" fillOpacity="1" fillRule="evenodd" stroke="none" d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18" />
                              <path fill="#fbbc05" fillOpacity="1" fillRule="evenodd" stroke="none" d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042z" />
                              <path fill="#ea4335" fillOpacity="1" fillRule="evenodd" stroke="none" d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71" />
                            </svg>
                          </span>
                          <span>Continue with Google</span>
                        </span>
                      </span>
                    </button>
                    <p className="sign_in_and_up--orBlock--vzasA">or</p>
                    <div className="x1n2onr6 xdpxx8g x9dczf4 xh8yej3">
                      <label className="x10l6tqk x1lliihq xuzi1b7 xtvhhri x1j6dyjg xo1l8bm xjbqb8w xmaolms xgwajed x11vz743 x563n8i" htmlFor="email">Email</label>
                      <input className="xjyslct xmaolms x1lliihq xh8yej3 x9dczf4 x9f619 x1kxipp6 xosj86m xc8nv1x x1kogg8i x101yacv x1pga9m1 x17410jd xqhu3d4 xf3yja8 xc342km xng3xce x9r1u3d xm3xvbb x1gnnqk1 x178j727 xq8o014 x1rhcbux xxqzaim x1robv96 lazy_input--lazyInput--akTHe" id="email" aria-describedby="email-error-text" aria-invalid="false" autoCapitalize="off" autoComplete="username" autoCorrect="off" name="email" type="email" dir="auto" defaultValue="" />
                    </div>
                    <div style={{ height: "24px" }} />
                    <button className="auth_view--brandButton--dD0L7 auth_view--brandButtonBase--EdORb auth_brand--figmaSans--Ba2vO sign_in_and_up--primaryWideButton--6QBTr auth_view--primaryWideButton--swKV2 auth_view--wideButton--zNJFc auth_view--fullWidth--KjWzg" type="submit">
                      <span><span className="svg-container" {...({ width: "24px", height: "24px" } as any)}><svg className="svg" xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21"><path fill="#fff" fillRule="evenodd" d="M11.957 3.719 18.5 10.5l-6.543 6.781-.642-.62 5.515-5.715H4.5v-.892h12.33l-5.515-5.715z" clipRule="evenodd" /></svg></span>Continue with email</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" hidden>
            <div style={{ "--_1rthyo80": "0", "--_1rthyo81": "NaN%" } as CSSProperties} data-fpl-component="" />
          </div>
        </div>
      </div>
      <div data-fpl-component="">
        <button data-fpl-component="" aria-label="Close" type="button" tabIndex={0}>
          <span aria-hidden="true">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path fill="var(--fpl-icon-color, var(--color-icon))" fillRule="evenodd" d="M16.854 7.146a.5.5 0 0 1 0 .707L12.707 12l4.147 4.146a.5.5 0 0 1-.708.707L12 12.708l-4.146 4.147a.5.5 0 1 1-.708-.708L11.293 12 7.146 7.854a.5.5 0 0 1 .708-.708L12 11.293l4.146-4.147a.5.5 0 0 1 .708 0" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}
