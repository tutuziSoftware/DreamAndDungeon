/**
 * Created with JetBrains WebStorm.
 * User: puruhime
 * Date: 2014/09/12
 * Time: 8:17
 * To change this template use File | Settings | File Templates.
 */
var Attack = function(){};

/**
 * この名前空間に含まれる定数は数値とします。
 * 複数の状態を持つ場合、ORで結合しANDで保持確認を行える為です。
 * @type {Object}
 */
Attack.TYPE = {};
Attack.TYPE.NONE = 1;
Attack.TYPE.SLAP = 2;

Attack.Range = function(){};