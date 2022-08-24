<!-- Comments.svelte -->
<script>

    // https://joshcollinsworth.com/blog/add-blog-comments-static-site

    import { onMount } from 'svelte'
  
    // An object with all the utterances options I want
    const options = {
      src: 'https://utteranc.es/client.js',
      repo: 'Wolsten/Baffled-By-Science',
      label: 'comments',
      crossorigin: 'anonymous',
      async: '',
      'issue-term': 'pathname',
    }
  
    onMount(() => {
      const utteranceScript = document.createElement('script')
      const targetTag = document.getElementById('utterances-comments')
    
      // Loop over the options & apply each property as an attribute
      for (const prop in options) {
        utteranceScript.setAttribute(prop, options[prop])
      }
  
      targetTag.appendChild(utteranceScript)
    })
  </script>

  <h2>Comments</h2>
  
  <div id="utterances-comments" />