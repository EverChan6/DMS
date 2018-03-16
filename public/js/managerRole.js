	


	// 标签页切换
	$(".navDiv li a").click(function(e)
	{
		e.preventDefault();
		$(this).tab("show");
	});