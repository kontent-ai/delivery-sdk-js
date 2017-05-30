this.kCloudService.getItems<CodeExample>(this.type, [
  new LimitParameter(5),
  new SkipParameter(1),
  new DepthParameter(5),
  new ElementsParameter(["title", "author", "category", "image", "name", "category_name"]),
  new OrderDescParameter("elements.title")
  new EqualsFilter("elements.title", "Rick")
]).subscribe(response => {
    console.log(response);
});