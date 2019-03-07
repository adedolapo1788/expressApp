$(document).ready(()=>{
    $('.delete-article').on('click',(e)=>{
        $target = $(e.target);
        const id =($target.attr('data-id'));
        $.ajax({
            type:'DELETE',
            url:'/articles/'+id,
            success:(response)=>{
                alert('deleting Article');
                window.location.href='/';
            },
            error:function(err){
                console.log(err); 
            }
        })
    });
});