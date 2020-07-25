import _ from 'lodash';

export function cartesianProduct() {
    let args = [...arguments];
    if (args.length == 0) return [[]];

    let rest = cartesianProduct( ...args.slice(1) );

    return _.flatMap(args[0], (a) => _.map(rest, (r) => [a, ...r]));
}
