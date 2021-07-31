"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var v3_sdk_1 = require("@uniswap/v3-sdk");
var sdk_core_1 = require("@uniswap/sdk-core");
var IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
var keys = __importStar(require("./keys.json"));
var provider = new ethers_1.ethers.providers.JsonRpcProvider(keys.jsonRPC);
// 
var poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
// 
var poolContract = new ethers_1.ethers.Contract(poolAddress, IUniswapV3Pool_json_1.abi, provider);
// fetch data function
function getPoolImmutables() {
    return __awaiter(this, void 0, void 0, function () {
        var immutables;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, poolContract.factory()];
                case 1:
                    _a.factory = _b.sent();
                    return [4 /*yield*/, poolContract.token0()];
                case 2:
                    _a.token0 = _b.sent();
                    return [4 /*yield*/, poolContract.token1()];
                case 3:
                    _a.token1 = _b.sent();
                    return [4 /*yield*/, poolContract.fee()];
                case 4:
                    _a.fee = _b.sent();
                    return [4 /*yield*/, poolContract.tickSpacing()];
                case 5:
                    _a.tickSpacing = _b.sent();
                    return [4 /*yield*/, poolContract.maxLiquidityPerTick()];
                case 6:
                    immutables = (_a.maxLiquidityPerTick = _b.sent(),
                        _a);
                    return [2 /*return*/, immutables];
            }
        });
    });
}
// fetching state data
function getPoolState() {
    return __awaiter(this, void 0, void 0, function () {
        var slot, PoolState;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, poolContract.slot0()];
                case 1:
                    slot = _b.sent();
                    _a = {};
                    return [4 /*yield*/, poolContract.liquidity()];
                case 2:
                    PoolState = (_a.liquidity = _b.sent(),
                        _a.sqrtPriceX96 = slot[0],
                        _a.tick = slot[1],
                        _a.observationIndex = slot[2],
                        _a.observationCardinality = slot[3],
                        _a.observationCardinalityNext = slot[4],
                        _a.feeProtocol = slot[5],
                        _a.unlocked = slot[6],
                        _a);
                    return [2 /*return*/, PoolState];
            }
        });
    });
}
// call all functions
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var immutables, state, TokenA, TokenB, poolExample;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPoolImmutables()];
                case 1:
                    immutables = _a.sent();
                    return [4 /*yield*/, getPoolState()];
                case 2:
                    state = _a.sent();
                    TokenA = new sdk_core_1.Token(1, immutables.token0, 6, "USDC", "USD Coin");
                    TokenB = new sdk_core_1.Token(1, immutables.token1, 18, "WETH", "Wrapped Ether");
                    poolExample = new v3_sdk_1.Pool(TokenA, TokenB, immutables.fee, state.sqrtPriceX96.toString(), state.liquidity.toString(), state.tick);
                    console.log(poolExample);
                    return [2 /*return*/];
            }
        });
    });
}
main();
