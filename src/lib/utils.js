export function tree_menu_sidebar(list) {
  var map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].menuid] = i;
    list[i].children = [];
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    // eslint-disable-next-line no-loop-func
    var parent = list.find((a) => a.menuid === node.parentid);
    if (parent !== undefined) list[map[node.parentid]].children.push(node);
    else roots.push(node);
  }
  return roots;
}

export function tree_menu(list) {
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
    var parent = list.find((a) => a.id === node.parentid);
    if (parent !== undefined) list[map[node.parentid]].children.push(node);
    else roots.push(node);
  }
  return roots;
}
