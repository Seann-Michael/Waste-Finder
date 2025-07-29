/**
 * Session Recording Integration
 * Supports multiple session recording providers
 */

interface SessionRecordingConfig {
  provider: "hotjar" | "fullstory" | "logrocket" | "disabled";
  siteId?: string;
  apiKey?: string;
  samplingRate?: number;
}

/**
 * Initialize session recording based on configuration
 */
export function initSessionRecording() {
  // Completely disable session recording to prevent router conflicts
  return;

  const config: SessionRecordingConfig = {
    provider:
      (import.meta.env.VITE_SESSION_RECORDING_PROVIDER as any) || "disabled",
    siteId: import.meta.env.VITE_SESSION_RECORDING_SITE_ID,
    apiKey: import.meta.env.VITE_SESSION_RECORDING_API_KEY,
    samplingRate: parseFloat(
      import.meta.env.VITE_SESSION_RECORDING_SAMPLE_RATE || "0.1",
    ),
  };

  // Skip in development unless explicitly enabled
  if (import.meta.env.DEV && config.provider !== "disabled") {
    console.log("Session recording disabled in development");
    return;
  }

  // Random sampling
  if (Math.random() > config.samplingRate) {
    return;
  }

  switch (config.provider) {
    case "hotjar":
      initHotjar(config.siteId!);
      break;
    case "fullstory":
      initFullStory(config.apiKey!);
      break;
    case "logrocket":
      initLogRocket(config.apiKey!);
      break;
    default:
      console.log("Session recording disabled or provider not configured");
  }
}

/**
 * Initialize Hotjar session recording
 */
function initHotjar(siteId: string) {
  if (!siteId) {
    console.warn("Hotjar site ID not configured");
    return;
  }

  (function (h: any, o: any, t: any, j: any, a?: any, r?: any) {
    h.hj =
      h.hj ||
      function (...args: any[]) {
        (h.hj.q = h.hj.q || []).push(args);
      };
    h._hjSettings = { hjid: parseInt(siteId), hjsv: 6 };
    a = o.getElementsByTagName("head")[0];
    r = o.createElement("script");
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");

  console.log("Hotjar session recording initialized");
}

/**
 * Initialize FullStory session recording
 */
function initFullStory(orgId: string) {
  if (!orgId) {
    console.warn("FullStory org ID not configured");
    return;
  }

  (window as any)["_fs_debug"] = false;
  (window as any)["_fs_host"] = "fullstory.com";
  (window as any)["_fs_script"] = "edge.fullstory.com/s/fs.js";
  (window as any)["_fs_org"] = orgId;
  (window as any)["_fs_namespace"] = "FS";

  (function (m: any, n: any, e: any, t: any, l: any, o: any, g: any, y: any) {
    if (e in m) {
      if (m.console && m.console.log) {
        m.console.log(
          'FullStory namespace conflict. Please set window["_fs_namespace"].',
        );
      }
      return;
    }
    g = m[e] = function (a: any, b: any, s: any) {
      g.q ? g.q.push([a, b, s]) : g._api(a, b, s);
    };
    g.q = [];
    o = n.createElement(t);
    o.async = 1;
    o.crossOrigin = "anonymous";
    o.src = "https://" + (window as any)._fs_script;
    y = n.getElementsByTagName(t)[0];
    y.parentNode!.insertBefore(o, y);
    g.identify = function (i: any, v: any, s: any) {
      g(l, { uid: i }, s);
      if (v) g(l, v, s);
    };
    g.setUserVars = function (v: any, s: any) {
      g(l, v, s);
    };
    g.event = function (i: any, v: any, s: any) {
      g("event", { n: i, p: v }, s);
    };
    g.anonymize = function () {
      g.identify(!!0);
    };
    g.shutdown = function () {
      g("rec", !1);
    };
    g.restart = function () {
      g("rec", !0);
    };
    g.log = function (a: any, b: any) {
      g("log", [a, b]);
    };
    g.consent = function (a: any) {
      g("consent", !arguments.length || a);
    };
    g.identifyAccount = function (i: any, v: any) {
      o = "account";
      v = v || {};
      v.acctId = i;
      g(o, v);
    };
    g.clearUserCookie = function () {};
    g.setVars = function (n: any, p: any) {
      g("setVars", [n, p]);
    };
    m[e] = g;
  })(window, document, (window as any)["_fs_namespace"], "script", "user");

  console.log("FullStory session recording initialized");
}

/**
 * Initialize LogRocket session recording
 */
function initLogRocket(appId: string) {
  if (!appId) {
    console.warn("LogRocket app ID not configured");
    return;
  }

  (window as any).LogRocket = (window as any).LogRocket || [];
  const lr = (window as any).LogRocket;

  lr.init =
    lr.init ||
    function (appId: string) {
      const script = document.createElement("script");
      script.src = "https://cdn.logrocket.io/LogRocket.min.js";
      script.async = true;
      script.onload = function () {
        (window as any).LogRocket.init(appId);
      };
      document.head.appendChild(script);
    };

  lr.init(appId);
  console.log("LogRocket session recording initialized");
}

/**
 * Track custom events in session recording
 */
export function trackSessionEvent(
  eventName: string,
  properties?: Record<string, any>,
) {
  // Session recording disabled
  return;
}

/**
 * Identify user in session recording
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  // Session recording disabled
  return;
}
