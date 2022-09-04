export function nestedMenu(list) {
  var map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i;
    list[i].children = [];
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    // eslint-disable-next-line no-loop-func
    var parent = list.find((a) => a.id === node.parent_id);
    if (parent !== undefined) list[map[node.parent_id]].children.push(node);
    else roots.push(node);
  }
  return roots;
}
