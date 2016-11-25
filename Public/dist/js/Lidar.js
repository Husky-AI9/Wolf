$('#toggle_event_editing button').click(function(){
	if($(this).hasClass('locked_active') || $(this).hasClass('unlocked_inactive')){
		/* code to do when unlocking */
        $('.lidar').show();
        $('.distance').show();
	}else{
		/* code to do when locking */
		$('.lidar').hide();
		$('.distance').hide();

	}
	
	/* reverse locking status */
	$('#toggle_event_editing button').eq(0).toggleClass('locked_inactive locked_active btn-default btn-info');
	$('#toggle_event_editing button').eq(1).toggleClass('unlocked_inactive unlocked_active btn-info btn-default');
});