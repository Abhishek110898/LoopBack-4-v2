"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratelimit = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
function ratelimit(enabled, options) {
    return core_1.MethodDecoratorFactory.createDecorator(keys_1.RATELIMIT_METADATA_ACCESSOR, {
        enabled: enabled,
        options,
    });
}
exports.ratelimit = ratelimit;
//# sourceMappingURL=ratelimit.decorator.js.map